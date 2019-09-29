import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Service } from '../../../model/service/service';
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
    this.getService();
  }

  ionViewWillLeave() {
    this.events.unsubscribe('solicitation:updated');
  }

  async getService() {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
    this.getProfiles();
  }

  private updateServiceEvent() {
    this.events.subscribe('solicitation:updated', (serv) => {
      this.updateServiceOut(serv);
      this.events.unsubscribe('solicitation:updated');
    });
  }

  private updateServiceOut(serv: any) {
    this.solicitation = serv;
    this.buildServiceStatusMessage(this.solicitation.status);
    this.setSolicitationStatusClass();
    if (this.solicitation.removedTo.contractorUid == this.userUid) {
      this.navCtrl.pop();
    }
    if (this.solicitation.status == Constants.SOLICITATION_IS_FINISHED) {
      var alertTitle = ""
      var alertBody = ""
      if (this.contractorPf.uid == this.userUid) {
        alertTitle = "Avaliar este profissional!"
        alertBody = "Dê a sua opnião sobre " + this.hiredPf.nome + " e seu serviço, ajudando outros usuários do Tips!"
      } else {
        alertTitle = "Avalie seu cliente!"
        alertBody = "Dê a sua opnião sobre " + this.contractorPf.nome + ", ajudando outros profissionais no Tips!"
      }

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
        this.buildServiceStatusMessage(this.solicitation.status);
        this.setSolicitationStatusClass();
        this.avaliationPending();
      })
      .catch(() => {
        this.navCtrl.pop();
        this.toast.showToast("Erro ao carregar solicitação!");
      })
  }

  buildServiceStatusMessage(status: string) {
    if (status == Constants.SOLICITATION_IS_OPEN) {
      this.btnActionText = "Cancelar";
      this.btnActionFunction = this.cancelServiceAction.bind(this);
      this.showSolicitationActions = true;
    } else if (status == Constants.SOLICITATION_IS_FINISHED || status == Constants.SOLICITATION_IS_CANCELED) {
      this.btnActionText = "Remover";
      this.btnActionFunction = this.cancelServiceAction.bind(this);
      this.showSolicitationActions = true;
    }
  }

  openOptions(event) {
    this.updateServiceEvent();
    this.popover.showPopover("SolicitationOptionsPage", { 'service': this.solicitation }, event)
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

  cancelServiceAction() {
    this.alert.confirmAlert(
      "Cancelar solicitação!",
      "Deseja cancelar esta solicitação? O Profissional solicitado não poderá ver essa solicitação!",
      () => {
        this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
        this.loadingMessage = "Cancelando solicitação...";
        this.toastMessage = "Solicitação cancelada!";
        this.updateService();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  removeServiceAction() {
    this.alert.confirmAlert(
      "Remover solicitação!",
      "Deseja aceitar esta solicitação?",
      () => {
        this.solicitation.removedTo.contractorUid = this.userUid;
        this.loadingMessage = "Removendo solicitação...";
        this.toastMessage = "Solicitação removida!";
        this.updateService();
      },
      () => { },
      "Não",
      "Sim"
    )
  }

  updateService() {
    this.loading.showLoading("Atualizando solicitação...")
      .then(() => {
        this.solicitation.lastActionByUserUid = this.userUid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast(this.toastMessage);
            this.setSolicitationStatusClass();
            this.buildServiceStatusMessage(this.solicitation.status);
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
    this.navCtrl.push("NewAvaliationPage", { 'service': this.solicitation });
  }
}
