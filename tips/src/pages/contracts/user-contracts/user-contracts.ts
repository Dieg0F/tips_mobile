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

  public contractType = "Todos"
  public contracts: Array<Contract>
  public myReceivedContracts: Array<Contract>
  public myDoneContracts: Array<Contract>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public contractProvider: ContractProvider) {
    this.contracts = new Array<Contract>();
    this.myDoneContracts = new Array<Contract>();
    this.myReceivedContracts = new Array<Contract>();
    this.getMyContracts();
  }

  getMyContracts() {
    this.loading.showLoading("Buscando Contratos...")
    this.contractProvider.getContractsByUser(AppConfig.USER_PROFILE.uid)
      .then((res) => {
        res.subscribe((values) => {
          this.splitContracts(values);
        })
      })
      .catch((err) => {
        console.log(err);
        this.loading.hideLoading();
        this.toast.showToast("Erro ao buscar contratos!")
      })
  }

  private splitContracts(values: any) {
    values.forEach(element => {
      if (element.userUid == AppConfig.USER_PROFILE.uid) {
        this.myDoneContracts.push(element);
      }
      else if (element.hiredUid == AppConfig.USER_PROFILE.uid) {
        this.myReceivedContracts.push(element);
      }
    });
    this.onFilterChange();
    this.loading.hideLoading();
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
    this.contracts = new Array<Contract>()
    switch (this.contractType) {
      case "Contratos Feitos":
        this.contracts = this.myDoneContracts
        break;
      case "Contratos Recebidos":
        this.contracts = this.myReceivedContracts
        break;
      default:
        this.contracts = this.myReceivedContracts
        break;
    }
  }

}
