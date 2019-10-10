import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { Constants } from '../../../util/constants/constants';
import { Toast } from '../../../util/toast/toast';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Solicitation } from '../../../model/solicitation/solicitation';

@IonicPage()
@Component({
  selector: 'page-solicitation-details',
  templateUrl: 'solicitation-details.html',
})
export class SolicitationDetailsPage {

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

  public solicitationDate: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public popover: Popover,
    public alert: Alert,
    public toast: Toast,
    public events: Events,
    public solicitationProvider: SolicitationProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getSolicitation();
    this.updateSolicitationEvent();
    this.events.subscribe("CHANGE_SOLICITATION", (data: any) => {
      this.solicitationProvider.getSolicitaiton(data)
        .then((res) => {
          this.updateSolicitationByEvent(res);
        })
    })
  }

  private updateSolicitationByEvent(res: any) {
    this.solicitation = res.data();
    this.buildSolicitationStatusMessage();
    this.setSolicitationStatusClass();
    this.avaliationPending();

    var toastMessage = "";
    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_RUNNING:
        toastMessage = "Solicitação aprovada por" + this.contractorPf.name.firstName + "!";
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        toastMessage = "Solicitação cancelada por" + this.contractorPf.name.firstName + "!";
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        toastMessage = "Solicitação finalizada por" + this.contractorPf.name.firstName + "!";
        break;
    }
    this.toast.showToast(toastMessage);
  }

  ionViewWillLeave() {
    this.events.unsubscribe("CHANGE_SOLICITATION");
    this.events.unsubscribe('USER_CHANGE_SOLICITATION');
  }
  async getSolicitation() {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
    this.solicitationDate = new Date(this.solicitation.date).toLocaleDateString();
    this.getProfiles();
  }

  private updateSolicitationEvent() {
    this.events.subscribe('USER_CHANGE_SOLICITATION', (serv: Solicitation) => {
      this.updateSolicitationOut(serv);
      this.events.unsubscribe('USER_CHANGE_SOLICITATION');
    });
  }

  private updateSolicitationOut(serv: any) {
    this.solicitation = serv;
    this.buildSolicitationStatusMessage();
    this.setSolicitationStatusClass();
    if (this.solicitation.removedTo.contractorUid == this.userUid) {
      this.navCtrl.pop();
    }
    if (this.solicitation.status == Constants.SOLICITATION_IS_FINISHED) {
      var alertTitle = ""
      var alertBody = ""
      alertTitle = "Avaliar este profissional!"
      alertBody = "Dê a sua opnião sobre " + this.hiredPf.name.firstName + " e seu serviço, ajudando outros usuários do Tips!"

      this.alert.confirmAlert(alertTitle,
        alertBody,
        this.avaliation.bind(this),
        () => { this.avaliationPending() },
        "Depois", "Agora");
    }
  }

  private getProfiles() {
    this.contractorPf = { ...AppConfig.USER_PROFILE };
    this.profileProvider.getProfile(this.solicitation.hiredUid)
      .then((res) => {
        this.hiredPf = res.data();
        this.buildSolicitationStatusMessage();
        this.setSolicitationStatusClass();
        this.avaliationPending();
      })
      .catch(() => {
        this.navCtrl.pop();
        this.toast.showToast("Erro ao carregar solicitação!");
      })
  }

  buildSolicitationStatusMessage() {
    if (this.solicitation.status == Constants.SOLICITATION_IS_OPEN) {
      this.btnActionText = "Cancelar";
      this.btnActionFunction = this.cancelSolicitationAction.bind(this);
      this.showSolicitationActions = true;
    } else if (this.solicitation.status == Constants.SOLICITATION_IS_FINISHED || status == Constants.SOLICITATION_IS_CANCELED) {
      this.btnActionText = "Remover";
      this.btnActionFunction = this.removeSolicitationAction.bind(this);
      this.showSolicitationActions = true;
    }
  }

  openOptions(event: any) {
    this.popover.showPopover("SolicitationOptionsPage", { 'solicitation': this.solicitation }, event)
  }

  setSolicitationStatusClass() {
    var statusClass = " "

    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusClass += "newSolicitation";
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusClass += "runningSolicitation";
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusClass += "finishedSolicitation";
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusClass += "canceledSolicitation";
        break;
    }

    this.solicitationStatusClass = statusClass;
  }

  setStatusValueToShow(status): string {
    var statusValue = ""

    switch (status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusValue += "Cancelado";
        break;
    }

    return statusValue;
  }

  cancelSolicitationAction() {
    this.alert.confirmAlert(
      "Cancelar solicitação!",
      "Deseja cancelar esta solicitação? O Profissional solicitado não poderá ver essa solicitação!",
      () => {
        this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
        this.loadingMessage = "Cancelando solicitação...";
        this.toastMessage = "Solicitação cancelada!";
        this.updateSolicitation();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  removeSolicitationAction() {
    this.alert.confirmAlert(
      "Remover solicitação!",
      "Deseja aceitar esta solicitação?",
      () => {
        this.solicitation.removedTo.contractorUid = this.userUid;
        this.loadingMessage = "Removendo solicitação...";
        this.toastMessage = "Solicitação removida!";
        this.updateSolicitation();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  updateSolicitation() {
    this.loading.showLoading("Atualizando solicitação...")
      .then(() => {
        this.solicitation.lastActionByUserUid = this.userUid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast(this.toastMessage);
            this.setSolicitationStatusClass();
            this.buildSolicitationStatusMessage();
          })
          .catch(() => {
            this.toast.showToast("Erro ao alterar solicitação!");
          })
      })
  }

  avaliationPending() {
    if (this.solicitation.avaliatedTo.contractorAvaliation == null &&
      (this.solicitation.status == Constants.SOLICITATION_IS_FINISHED)) {
      this.btnActionText = "Avaliar Serviço";
      this.btnActionFunction = this.avaliation;
      this.showSolicitationActions = true;
    }
  }

  avaliation() {
    this.navCtrl.push("NewAvaliationPage", { 'solicitation': this.solicitation });
  }
}
