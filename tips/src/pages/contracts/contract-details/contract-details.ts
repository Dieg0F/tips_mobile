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
  selector: 'page-contract-details',
  templateUrl: 'contract-details.html',
})
export class ContractDetailsPage {

  public contract: Contract;
  public contractStatus: string = "";
  public contractorProfile: Profile;
  public hiredProfile: Profile;
  public userUid = AppConfig.USER_PROFILE.uid;

  public btnActionText = "";
  public btnActionFunction: Function;

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
        this.buildContractStatusMessage();
      })
  }

  buildContractStatusMessage() {
    switch (this.contract.status) {
      case Constants.CONTRACT_IS_OPEN:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "Você ainda não aprovou este contrato!";
          this.btnActionText = "Aprovar";
          this.btnActionFunction = this.acceptContractAction.bind(this);
        } else {
          this.contractStatus = "Aguardando aprovação do contratado!";
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_CANCEL:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "O contratado cancelou este contrato!";
          this.btnActionText = "Cancelar";
          this.btnActionFunction = this.cancelContractAction.bind(this);
        } else {
          this.contractStatus = "Você cancelou este contrato!";
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_FINISH:
        if (this.contract.lastActionByUserUid != this.userUid) {
          this.contractStatus = "O contratado finalizou este contrato!";
          this.btnActionText = "Finalizar";
          this.btnActionFunction = this.finishContratcAction.bind(this);
        } else {
          this.contractStatus = "Você finalizou este contrato!";
        }
        break;
    }

    console.log("Contractor: " + this.contractorProfile.uid);
    console.log("Hired: " + this.hiredProfile.uid);
    console.log("Last Action By: " + this.contract.lastActionByUserUid);
    console.log("User: " + this.userUid);
  }

  openOptions(event) {
    this.popover.showPopover("ContractOptionsPage", { 'contract': this.contract }, event)
  }

  setContractStatusClass(status): String {
    var statusClass = " "

    switch (status) {
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

    return statusClass;
  }

  setStatusValueToShow(status): String {
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
    this.contract.lastActionByUserUid = this.userUid;
    this.loading.showLoading(this.loadingMessage)
    this.contractProvider.updateContract(this.contract)
      .then(() => {
        this.toast.showToast(this.toastMessage);
      })
      .catch(() => {
        this.toast.showToast("Erro ao atualizar o status do contrato.");
      })
  }
}
