import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { AppConfig } from '../../../model/static/static';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Toast } from '../../../util/toast/toast';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Popover } from './../../../util/popover/popover';

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
  public btnActionText = '';
  // tslint:disable-next-line:ban-types
  public btnActionFunction: Function;
  public solicitationStatusClass: string = '';
  public solicitationStatus: string = '';
  public showSolicitationActions: boolean = false;
  public loadingMessage = '';
  public toastMessage = '';
  public solicitationDate: string = '';

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

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getSolicitation();
    this.events.subscribe('CHANGE_SOLICITATION', (data: any) => {
      this.solicitationProvider.getSolicitaiton(data)
        .then((res) => {
          this.updateSolicitationByEvent(res);
        });
    });
    this.events.subscribe('UPDATE_PROFILE_RATED', (data: any) => {
      this.getProfiles();
    });
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('CHANGE_SOLICITATION');
    this.events.unsubscribe('USER_CHANGE_SOLICITATION');
    this.events.unsubscribe('UPDATE_PROFILE_RATED');
  }

  /**
   * @description recover solicitation received as params.
   */
  public async getSolicitation() {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
    this.solicitationDate = new Date(this.solicitation.date).toLocaleDateString();
    this.getProfiles();
  }

  /**
   * @description build solicitation status message.
   */
  public buildSolicitationStatusMessage() {
    if (this.solicitation.status === Constants.SOLICITATION_IS_OPEN) {
      this.btnActionText = 'Cancelar Solicitação';
      this.btnActionFunction = this.cancelSolicitationAction.bind(this);
      this.showSolicitationActions = true;
    } else if (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED ||
      this.solicitation.status === Constants.SOLICITATION_IS_CANCELED) {
      this.btnActionText = 'Remover Solicitação';
      this.btnActionFunction = this.removeSolicitationAction.bind(this);
      this.showSolicitationActions = true;
    }
  }

  /**
   * @description open options menu.
   * @param event event from view.
   */
  public openOptions(event: any) {
    this.updateSolicitationEvent();
    this.popover.showPopover('SolicitationOptionsPage', { solicitation: this.solicitation }, event);
  }

  /**
   * @description cancel solicitation alert information.
   */
  public cancelSolicitationAction() {
    this.alert.confirmAlert(
      'Cancelar solicitação!',
      'Deseja cancelar esta solicitação? O Profissional solicitado não poderá ver essa solicitação!',
      () => {
        this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
        this.solicitation.removedTo.hiredUid = this.solicitation.hiredUid;
        this.loadingMessage = 'Cancelando solicitação...';
        this.toastMessage = 'Solicitação cancelada!';
        this.updateSolicitation();
      },
      () => { },
      'Não',
      'Sim',
    );
  }

  /**
   * @description remove solicitation alert information.
   */
  public removeSolicitationAction() {
    this.alert.confirmAlert(
      'Remover solicitação!',
      'Deseja aceitar esta solicitação?',
      () => {
        this.solicitation.removedTo.contractorUid = this.userUid;
        this.loadingMessage = 'Removendo solicitação...';
        this.toastMessage = 'Solicitação removida!';
        this.updateSolicitation();
      },
      () => { },
      'Não',
      'Sim',
    );
  }

  /**
   * @description update solicitation alert information.
   */
  public updateSolicitation() {
    this.loading.showLoading('Atualizando solicitação...')
      .then(() => {
        this.solicitation.lastActionByUserUid = this.userUid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.onSuccess();
          })
          .catch(() => {
            this.toast.showToast('Erro ao alterar solicitação!');
          });
      });
  }

  /**
   * @description enable avaliation option on view.
   */
  public avaliationPending() {
    if (this.solicitation.avaliatedTo.contractorAvaliation == null &&
      (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED)) {
      this.btnActionText = 'Avaliar Serviço';
      this.btnActionFunction = this.avaliation;
      this.showSolicitationActions = true;
    }
  }

  /**
   * @description redirect user to new avaliation page.
   */
  public avaliation() {
    this.navCtrl.push('NewAvaliationPage', { solicitation: this.solicitation });
  }

  /**
   * @description Open Profile Photo Modal, for edit and better image view.
   */
  public viewProfileImage() {
    this.navCtrl.push('ImageOptionsPage', { isVisitor: true, profile: this.hiredPf });
  }

  /**
   * @description Open profile page for more details.
   */
  public viewProfile() {
    this.navCtrl.push('ProfileDetailsPage', { isVisitor: true, profile: this.hiredPf });
  }

  /**
   * @description update solicitation event from other pages.
   */
  private updateSolicitationByEvent(res: any) {
    this.solicitation = res.data();
    this.buildSolicitationStatusMessage();
    this.avaliationPending();

    let toastMessage = '';
    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_RUNNING:
        toastMessage = 'Solicitação aprovada por ' + this.contractorPf.name.firstName + '!';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        toastMessage = 'Solicitação cancelada por ' + this.contractorPf.name.firstName + '!';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        toastMessage = 'Solicitação finalizada por ' + this.contractorPf.name.firstName + '!';
        break;
    }
    this.toast.showToast(toastMessage);
  }

  /**
   * @description update solicitation event .
   */
  private updateSolicitationEvent() {
    this.events.subscribe('USER_CHANGE_SOLICITATION', (serv: Solicitation) => {
      this.updateSolicitationOut(serv);
      this.events.unsubscribe('USER_CHANGE_SOLICITATION');
    });
  }

  /**
   * @description update solicitation event from other menu options.
   */
  private updateSolicitationOut(serv: any) {
    this.solicitation = serv;
    this.buildSolicitationStatusMessage();
    if (this.solicitation.removedTo.contractorUid === this.userUid) {
      this.navCtrl.pop();
    }
    if (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED) {
      let alertTitle = '';
      let alertBody = '';
      alertTitle = 'Avaliar este profissional!';
      alertBody = 'Dê a sua opnião sobre ' + this.hiredPf.name.firstName + ' e seu serviço, ajudando outros usuários do Tips!';

      this.alert.confirmAlert(alertTitle,
        alertBody,
        this.avaliation.bind(this),
        () => { this.avaliationPending(); },
        'Depois', 'Agora');
    }
  }

  /**
   * @description request hired profired.
   */
  private getProfiles() {
    this.contractorPf = { ...AppConfig.USER_PROFILE };
    this.profileProvider.getProfile(this.solicitation.hiredUid)
      .then((res) => {
        this.hiredPf = res.data();
        this.buildSolicitationStatusMessage();
        this.avaliationPending();
      })
      .catch(() => {
        this.navCtrl.pop();
        this.toast.showToast('Erro ao carregar solicitação!');
      });
  }

  /**
   * @description show success messages to user.
   */
  private onSuccess() {
    this.loading.hideLoading();
    this.toast.showToast(this.toastMessage);
    this.buildSolicitationStatusMessage();
    if (this.solicitation.removedTo.contractorUid === this.userUid) {
      this.navCtrl.pop();
    }
  }
}
