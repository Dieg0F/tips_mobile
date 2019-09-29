import { Solicitation } from './../../../model/solicitation/solicitation';
import { AvaliationProvider } from './../../../providers/avaliation/avaliation';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';
import { AppConfig } from '../../../model/static/static';
import { Events } from 'ionic-angular';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';

@IonicPage()
@Component({
  selector: 'page-solicitation-options',
  templateUrl: 'solicitation-options.html',
})
export class SolicitationOptionsPage {

  public solicitation: Solicitation;

  public solicitationFinishedStatus = Constants.SOLICITATION_IS_FINISHED
  public userUid = AppConfig.USER_PROFILE.uid

  public loadingMessage = ""
  public toastMessage = ""

  public removeAction: boolean = false;
  public cancelAction: boolean = false;
  public finishAction: boolean = false;

  public asContractor: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public alert: Alert,
    public events: Events,
    public serviceProvider: SolicitationProvider,
    public avaliationProvider: AvaliationProvider) {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
  }

  ionViewWillEnter() {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);

    if (this.solicitation.contractorUid == this.userUid) {
      this.asContractor = true;
    } else {
      this.asContractor = false;
    }

    this.setButtons();
  }

  setButtons() {
    if (this.solicitation.status == Constants.SOLICITATION_IS_FINISHED ||
      this.solicitation.status == Constants.SOLICITATION_IS_CANCELED) {
      this.removeAction = true;
      this.cancelAction = false;
      this.finishAction = false;
    }

    if (this.solicitation.status == Constants.SOLICITATION_IS_RUNNING) {
      this.cancelAction = true;
      this.finishAction = true;
      this.removeAction = false;
    }

    if (this.solicitation.status == Constants.SOLICITATION_IS_OPEN) {
      this.cancelAction = true;
      this.finishAction = false;
      this.removeAction = false;
    }
  }

  cancelSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Cancelar Serviço",
          "Deseja cancelar este serviço?",
          this.cancelSolicitation.bind(this),
          () => { })
      })

  }

  removeSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Remover Serviço",
          "Deseja remover este serviço?",
          this.removeSolicitation.bind(this),
          () => { })
      })

  }

  finishSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Finalizar Serviço",
          "Deseja finalizar este serviço?",
          this.finishSolicitation.bind(this),
          () => { })
      })

  }


  finishSolicitation() {
    this.solicitation.status = Constants.SOLICITATION_IS_FINISHED;
    this.loadingMessage = "Finalizando serviço...";
    this.toastMessage = "Serviço finalizado!";
    this.updateSolicitation();
  }

  cancelSolicitation() {
    this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
    this.loadingMessage = "Cancelando serviço...";
    this.toastMessage = "Serviço cancelado!";
    this.updateSolicitation();
  }

  removeSolicitation() {
    if (this.asContractor) {
      this.solicitation.removedTo.contractorUid = this.userUid;
    } else {
      this.solicitation.removedTo.hiredUid = this.userUid;
    }
    this.loadingMessage = "Removendo serviço...";
    this.toastMessage = "Serviço removido!";
    this.updateSolicitation();
  }

  async updateSolicitation() {
    this.solicitation.lastActionByUserUid = this.userUid;
    await this.loading.showLoading(this.loadingMessage)
      .then(async () => {
        return await this.serviceProvider.updateSolicitation(this.solicitation)
          .then(async () => {
            await this.success();
          })
      })
      .catch((err) => {
        console.log("Error: SolicitationOptionsPage, Loading Hide");
        console.log("Error: ", err);
        this.error();
      })
  }

  success() {
    try {
      this.loading.hideLoading();
      this.toast.showToast(this.toastMessage);
      this.events.publish('solicitation:updated', this.solicitation);
    } catch (error) {
      console.log("Error: SolicitationOptionsPage, Loading Hide");
      console.log("Error: ", error);
    }
  }

  error() {
    this.loading.hideLoadingPromise()
      .then(() => {
        return this.toast.showToast("Erro ao atualizar o status do serviço.");
      })
      .catch(() => {
        console.log("Error: SolicitationOptionsPage, Loading Hide")
      })
  }

  close(): Promise<any> {
    return this.viewCtrl.dismiss();
  }
}
