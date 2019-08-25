import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contract } from '../../../model/contract/contract';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { Constants } from '../../../util/constants/constants';
import { ContractProvider } from '../../../providers/contract/contract';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {

  public contract: Contract;
  public contractorProfile: Profile;
  public hiredProfile: Profile;
  public userUid = AppConfig.USER_PROFILE.uid;

  public btnActionText = "";
  public btnActionFunction: Function;

  public contractStatusClass: string = "";
  public contractStatus: string = "";

  public showContractActions: boolean = false;

  public loadingMessage = "";
  public toastMessage = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public popover: Popover,
    public alert: Alert,
    public toast: Toast,
    public contractProvider: ContractProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getContract();
  }

  async getContract() {
    this.contract = this.navParams.get(Constants.CONTRACT_DETAILS);

    var profileUidToRequest = "";

    if (this.contract.contractorUid == this.userUid) {
      this.contractorProfile = { ...AppConfig.USER_PROFILE }
      profileUidToRequest = this.contract.hiredUid
    } else {
      this.hiredProfile = { ...AppConfig.USER_PROFILE }
      profileUidToRequest = this.contract.contractorUid
    }

    this.profileProvider.getProfile(profileUidToRequest)
      .then((res) => {
        if (this.contractorProfile == undefined || this.contractorProfile == null) {
          this.contractorProfile = res.data();
        } else {
          this.hiredProfile = res.data();
        }
        this.buildContractStatusMessage(this.contract.status);
      })
  }

  buildContractStatusMessage(status: string) {
    switch (status) {
      case Constants.CONTRACT_IS_OPEN:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "Você ainda não aprovou este contrato!";
          this.btnActionText = "Aprovar";
          this.btnActionFunction = this.acceptContractAction.bind(this);
          this.showContractActions = true;
        } else {
          this.contractStatus = "Aguardando aprovação do contratado!";
          this.showContractActions = false;
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_CANCEL:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "O contratado cancelou este contrato!";
          this.btnActionText = "Cancelar";
          this.btnActionFunction = this.cancelContractAction.bind(this);
          this.showContractActions = true;
        } else {
          this.contractStatus = "Você cancelou este contrato!";
          this.showContractActions = false;
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_FINISH:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "O contratado finalizou este contrato!";
          this.btnActionText = "Finalizar";
          this.btnActionFunction = this.finishContratcAction.bind(this);
          this.showContractActions = true;
        } else {
          this.contractStatus = "Você finalizou este contrato!";
          this.showContractActions = false;
        }
        break;
      case Constants.CONTRACT_IS_RUNNING:
        this.contractStatus = "Contrato em andamento!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showContractActions = false;
        break;
      case Constants.CONTRACT_IS_FINISHED:
        this.contractStatus = "Contrato finalizado!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showContractActions = false;
        break;
      case Constants.CONTRACT_IS_CANCELED:
        this.contractStatus = "Contrato cancelado!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showContractActions = false;
        break;
    }

    console.log("Contractor: " + this.contractorProfile.uid);
    console.log("Hired: " + this.hiredProfile.uid);
    console.log("Last Action By: " + this.contract.lastActionByUserUid);
    console.log("User: " + this.userUid);
  }

  openOptions(event) {
    this.popover.showPopover("ServiceOptionsPage", { 'contract': this.contract }, event)
  }

  setContractStatusClass() {
    var statusClass = " "

    switch (this.contract.status) {
      case Constants.CONTRACT_IS_OPEN:
        statusClass += "newContract";
        break;
      case Constants.CONTRACT_IS_RUNNING:
        statusClass += "runningContract";
        break;
      case Constants.CONTRACT_IS_FINISHED:
        statusClass += "finishedContract";
        break;
      case Constants.CONTRACT_IS_CANCELED:
        statusClass += "canceledContract";
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_FINISH:
        statusClass += "finishedContract";
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_CANCEL:
        statusClass += "canceledContract";
        break;
      case Constants.CONTRACT_IS_REMOVED:
        statusClass += "removedContract";
        break;
    }

    this.contractStatusClass = statusClass;
  }

  setStatusValueToShow(status): string {
    var statusValue = ""

    switch (status) {
      case Constants.CONTRACT_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.CONTRACT_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.CONTRACT_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.CONTRACT_IS_CANCELED:
        statusValue += "Cancelado";
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_FINISH:
        statusValue += "Finalizando";
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_CANCEL:
        statusValue += "Cancelando";
        break;
      case Constants.CONTRACT_IS_REMOVED:
        statusValue += "Removido";
        break;
    }

    return statusValue;
  }

  cancelContractAction() {
    this.alert.confirmAlert(
      "Cancelamento de contrato!",
      "O Contratante cancelou este contrato! Você confirma o cancelamento?",
      () => { this.cancelContract() },
      () => { },
      "Não",
      "Sim"
    )
  }

  finishContratcAction() {
    this.alert.confirmAlert(
      "Finalizar contrato!",
      "O Contratante finalizou este contrato! Você confirma o termino do contrato?",
      () => { this.finishContract() },
      () => { },
      "Não",
      "Sim"
    )
  }

  acceptContractAction() {
    this.alert.confirmAlert(
      "Aceitar contrato!",
      "Deseja aceitar este contrato?",
      () => { this.acceptContract() },
      () => { },
      "Não",
      "Sim"
    )
  }

  finishContract() {
    this.contract.status = Constants.CONTRACT_IS_FINISHED;
    this.loadingMessage = "Finalizando contrato...";
    this.toastMessage = "Contrato finalizado!";
    this.updateContract();
  }

  cancelContract() {
    this.contract.status = Constants.CONTRACT_IS_CANCELED;
    this.loadingMessage = "Cancelando contrato...";
    this.toastMessage = "";
    this.updateContract();
  }

  acceptContract() {
    this.contract.status = Constants.CONTRACT_IS_RUNNING
    this.loadingMessage = "Aceitando contrato...";
    this.toastMessage = "Contrato aceito!";
    this.updateContract();
  }

  updateContract() {
    this.contractProvider.updateContractAction(this.contract, this.userUid)
      .then(() => {
        this.toast.showToast(this.toastMessage);
        this.setContractStatusClass();
        this.buildContractStatusMessage(this.contract.status);
      })
      .catch(() => {
        this.toast.showToast("Erro ao alterar contrato!");
      })
  }
}
