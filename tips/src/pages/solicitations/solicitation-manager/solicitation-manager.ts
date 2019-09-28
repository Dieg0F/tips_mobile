import { Solicitation } from './../../../model/solicitation/solicitation';
import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { Constants } from '../../../util/constants/constants';
import { ServiceProvider } from '../../../providers/service/service';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-solicitation-manager',
  templateUrl: 'solicitation-manager.html',
})
export class SolicitationManagerPage {

  public solicitation: Solicitation;
  public contractorPf: Profile;
  public hiredPf: Profile;
  public userUid = AppConfig.USER_PROFILE.uid;

  public btnActionText = "";
  public btnActionFunction: Function;

  public solicitationStatusClass: string = "";
  public solicitationStatus: string = "";

  public showSolicitationActions: boolean = false;

  public loadingMessage = "";
  public toastMessage = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public popover: Popover,
    public alert: Alert,
    public toast: Toast,
    public events: Events,
    public serviceProvider: ServiceProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getSolicitation();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('solicitation:updated');
  }

  async getSolicitation() {
    this.solicitation = this.navParams.get(Constants.SERVICE_DETAILS);
    this.getProfiles();
  }

  private updateSolicitationEvent() {
    this.events.subscribe('solicitation:updated', (serv) => {
      this.updateSolicitationOut(serv);
      this.events.unsubscribe('solicitation:updated');
    });
  }

  private updateSolicitationOut(serv: any) {
    this.solicitation = serv;
    this.buildSolicitationStatusMessage();
    this.setSolicitationStatusClass();
    if (this.solicitation.status == Constants.SERVICE_IS_REMOVED) {
      this.navCtrl.pop();
    }
    if (this.solicitation.status == Constants.SERVICE_IS_FINISHED) {
      var alertTitle = ""
      var alertBody = ""
      alertTitle = "Avalie seu cliente!"
      alertBody = "Dê a sua opnião sobre " + this.contractorPf.nome + ", ajudando outros profissionais no Tips!"

      this.alert.confirmAlert(alertTitle,
        alertBody,
        this.avaliation.bind(this),
        () => { this.avaliationPending() },
        "Depois", "Agora");
    }
  }

  private getProfiles() {
    this.hiredPf = { ...AppConfig.USER_PROFILE };
    this.profileProvider.getProfile(this.solicitation.contractorUid)
      .then((res) => {
        this.contractorPf = res.data();
        this.buildSolicitationStatusMessage();
        this.setSolicitationStatusClass();
        this.avaliationPending();
      })
  }

  buildSolicitationStatusMessage() {
    if (this.solicitation.status == Constants.SERVICE_IS_OPEN) {
      this.btnActionText = "Aprovar Solicitação";
      this.btnActionFunction = this.acceptSolicitationAction;
      this.showSolicitationActions = true;
      console.log(status)
    } else {
      this.btnActionText = "";
      this.btnActionFunction = null;
      this.showSolicitationActions = false;
    }
  }

  openOptions(event) {
    this.updateSolicitationEvent();
    this.popover.showPopover("SolicitationOptionsPage", { 'service': this.solicitation }, event)
  }

  setSolicitationStatusClass() {
    var statusClass = " "

    switch (this.solicitation.status) {
      case Constants.SERVICE_IS_OPEN:
        statusClass += "newSolicitation";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusClass += "runningSolicitation";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusClass += "finishedSolicitation";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusClass += "canceledSolicitation";
        break;
    }

    this.solicitationStatusClass = statusClass;
  }

  setStatusValueToShow(status): string {
    var statusValue = ""

    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusValue += "Cancelado";
        break;
    }

    return statusValue;
  }

  cancelSolicitationAction() {
    this.alert.confirmAlert(
      "Cancelar solicitação!",
      "Deseja cancelar esta solicitação?",
      () => {
        this.solicitation.status = Constants.SERVICE_IS_CANCELED;
        this.loadingMessage = "Cancelando serviço...";
        this.toastMessage = "";
        this.updateSolicitation();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  finishContratcAction() {
    this.alert.confirmAlert(
      "Finalizar solicitação!",
      "Deseja finalizar esta solicitação?",
      () => {
        this.solicitation.status = Constants.SERVICE_IS_FINISHED;
        this.loadingMessage = "Finalizando serviço...";
        this.toastMessage = "Serviço finalizado!";
        this.updateSolicitation();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  acceptSolicitationAction() {
    this.alert.confirmAlert(
      "Aceitar solicitação!",
      "Você aceita esta solicitação?",
      () => {
        this.solicitation.status = Constants.SERVICE_IS_RUNNING
        this.loadingMessage = "Aceitando serviço...";
        this.toastMessage = "Serviço aceito!";
        this.updateSolicitation();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  updateSolicitation() {
    this.loading.showLoading("Atualizando serviço...")
      .then(() => {
        this.serviceProvider.updateServiceAction(this.solicitation, this.userUid)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast(this.toastMessage);
            this.setSolicitationStatusClass();
            this.buildSolicitationStatusMessage();
          })
          .catch(() => {
            this.toast.showToast("Erro ao alterar serviço!");
          })
      })
  }

  avaliationPending() {
    if (this.solicitation.avaliationUid == null &&
      (this.solicitation.status == Constants.SERVICE_IS_FINISHED)) {
      this.btnActionText = "Avaliar Serviço";
      this.btnActionFunction = this.avaliation;
      this.showSolicitationActions = true;
    }
  }

  avaliation() {
    this.navCtrl.push("NewAvaliationPage", { 'service': this.solicitation });
  }

}
