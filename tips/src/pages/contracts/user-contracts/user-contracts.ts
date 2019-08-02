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

  public contracts = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public contractProvider: ContractProvider) {
    this.contracts = new Array<Contract>()
    this.getContracts();
  }

  getContracts() {
    this.loading.showLoading("Buscando Contratos...")
    this.contractProvider.getContractsByUser(AppConfig.USER_PROFILE.uid)
      .then((res) => {
        res.subscribe((values) => {
          this.contracts = values;
          this.loading.hideLoading();
        })
      })
      .catch((err) => {
        console.log(err);
        this.loading.hideLoading();
        this.toast.showToast("Erro ao buscar contratos!")
      })
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
}
