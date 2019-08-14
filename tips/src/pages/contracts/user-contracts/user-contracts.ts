import { Constants } from './../../../util/constants/constants';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContractProvider } from '../../../providers/contract/contract';
import { Contract } from '../../../model/contract/contract';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-user-contracts',
  templateUrl: 'user-contracts.html',
})
export class UserContractsPage {

  public contracts: Array<Contract> = new Array<Contract>();
  public allContracts: Array<Contract> = new Array<Contract>();

  public userId = AppConfig.USER_PROFILE.uid;

  public contractType = Constants.ALL_CONTRACTS;

  public requestingContracts = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public contractProvider: ContractProvider) {
    this.getContracts()
  }

  ionViewWillEnter() {
    this.onFilterChange();
  }

  getContracts() {
    this.contracts = new Array<Contract>();
    this.allContracts = new Array<Contract>();
    this.loading.showLoading("Buscando contratos...");
    this.contractProvider.getContracts(this.userId)
      .then((res) => {
        res.subscribe((values) => {
          this.allContracts = values;
          this.contracts = values;
          this.setContractStatusClass()
          this.onSuccess();
        })
      })
      .catch((err) => {
        console.log(err);
        this.onError();
      })
  }

  private onSuccess() {
    this.requestingContracts = false
    this.loading.hideLoading();
    if (this.contracts.length > 1) {
      this.toast.showToast("Exibindo " + this.contracts.length.toString() + " contratos!");
    }
  }

  private onError() {
    this.loading.hideLoading();
    this.toast.showToast("Erro ao buscar avaliações!");
  }

  goToDetails(contract: any) {
    this.profileProvider.getProfile(contract.hiredUid)
      .then((res) => {
        this.navCtrl.push('ContractDetailsPage', { 'contract': contract, 'hiredProfile': res.data() })
      })
      .catch(() => {
        this.toast.showToast("Erro ao exibir detalhes do contrato!")
      })
  }

  onFilterChange() {
    this.requestingContracts = true
    this.contracts = new Array<Contract>()
    switch (this.contractType) {
      case Constants.ALL_CONTRACTS:
        this.getAllContracts();
        break;
      case Constants.CONTRACTS_RECEIVED:
        this.getReceivedContracts();
        break;
      case Constants.CONTRACTS_DONE:
        this.getDoneContracts();
        break;
      default:
        this.getContractsByStatus(this.contractType);
        break;
    }
  }

  private getReceivedContracts() {
    this.allContracts.forEach(el => {
      if (el.hiredUid == this.userId) {
        this.contracts.push(el);
      }
    })
  }

  private getDoneContracts() {
    this.allContracts.forEach(el => {
      if (el.contractId == this.userId) {
        this.contracts.push(el);
      }
    })
  }

  private getAllContracts() {
    this.contracts = this.allContracts;
  }

  private getContractsByStatus(status: string) {
    this.allContracts.forEach(el => {
      if (el.status == status) {
        this.contracts.push(el);
      }
    })
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
}
