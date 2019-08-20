import { AvaliationProvider } from './../../../providers/avaliation/avaliation';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { ContractProvider } from './../../../providers/contract/contract';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';
import { AppConfig } from '../../../model/static/static';
import { Contract } from '../../../model/contract/contract';

@IonicPage()
@Component({
  selector: 'page-contract-options',
  templateUrl: 'contract-options.html',
})
export class ContractOptionsPage {

  public contract: Contract;

  public contractFinishedStatus = Constants.CONTRACT_IS_FINISHED
  public userUid = AppConfig.USER_PROFILE.uid

  public loadingMessage = ""
  public toastMessage = ""

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public alert: Alert,
    public contractProvider: ContractProvider,
    public avaliationProvider: AvaliationProvider) {
    this.contract = this.navParams.get(Constants.CONTRACT_DETAILS);
  }

  ionViewWillEnter() {
    this.contract = this.navParams.get(Constants.CONTRACT_DETAILS);
  }

  cancelContractAlert() {
    this.close();
    this.alert.confirmAlert("Cancelar Contrato", "Deseja cancelar este contrato?", this.cancelContract.bind(this), () => { })
  }

  removeContractAlert() {
    this.close()
    this.alert.confirmAlert("Remover Contrato", "Deseja remover este contrato?", this.removeContract.bind(this), () => { })
  }

  finishContractAlert() {
    this.close()
    this.alert.confirmAlert("Finalizar Contrato", "Deseja finalizar este contrato?", this.finishContract.bind(this), () => { })
  }


  finishContract() {
    this.contract.status = Constants.CONTRACT_IS_FINISHED;
    this.loadingMessage = "Finalizando contrato...";
    this.toastMessage = "Contrato finalizado!";
  }

  cancelContract() {
    this.contract.status = Constants.CONTRACT_IS_CANCELED;
    this.loadingMessage = "Cancelando contrato...";
    this.toastMessage = "Contrato cancelado!";
  }

  removeContract() {
    this.contract.status = Constants.CONTRACT_IS_REMOVED
    this.contract.isRemoved = true;
    this.loadingMessage = "Removendo contrato...";
    this.toastMessage = "Contrato removido!";
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

  close() {
    this.viewCtrl.dismiss();
  }
}
