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

  public userId = AppConfig.USER_PROFILE.uid;

  public contractType = "Todos os contratos";

  public requestingContracts = true;

  private subscription: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public contractProvider: ContractProvider) {

  }

  ionViewWillEnter() {
    this.onFilterChange();
  }

  getReceivedContracts() {
    this.loading.showLoading("Buscando contratos...")
    this.contractProvider.getContractsByUser(this.userId, null)
      .then((res) => {
        this.subscription = res.subscribe((values) => {
          this.contracts = new Array<Contract>()
          console.log("getReceivedContracts", this.contracts)
          this.contracts = values;
          this.onSuccess();
        })
      })
      .catch((err) => {
        console.log(err);
        this.onError()
      })
  }

  getDoneContracts() {
    this.loading.showLoading("Buscando contratos...")
    this.contractProvider.getContractsByUser(null, this.userId)
      .then((res) => {
        this.subscription = res.subscribe((values) => {
          this.contracts = new Array<Contract>()
          console.log("getDoneContracts", this.contracts)
          this.contracts = values;
          this.onSuccess();
        })
      })
      .catch((err) => {
        console.log(err);
        this.onError();
      })
  }

  getAllContracts() {
    this.loading.showLoading("Buscando contratos...")
    this.contractProvider.getContractsByUser(this.userId, null)
      .then((received) => {
        this.subscription = received.subscribe((receivedContracts) => {
          this.subscription.unsubscribe()
          return this.contractProvider.getContractsByUser(null, this.userId)
            .then((done) => {
              this.contracts = new Array<Contract>()
              this.contracts = []
              console.log("getAllContracts", this.contracts)
              this.subscription = done.subscribe((doneContracts) => {
                doneContracts.forEach(doneContract => {
                  this.contracts.push(doneContract)
                });
                receivedContracts.forEach(receivedContract => {
                  this.contracts.push(receivedContract)
                });
                console.log("getAllContracts", this.contracts)
                this.onSuccess();
              })
            })
        })
      })
      .catch((err) => {
        console.log(err);
        this.loading.hideLoading();
        this.toast.showToast("Erro ao buscar contratos!")
      })
  }

  private onSuccess() {
    this.requestingContracts = false
    this.loading.hideLoading();
    this.subscription.unsubscribe();
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
      case "Contratos feitos":
        this.getDoneContracts();
        break;
      case "Contratos recebidos":
        this.getReceivedContracts();
        break;
      default:
        this.getAllContracts();
        break;
    }
  }
}
