import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Toast } from '../../../util/toast/toast';
import { Solicitation } from './../../../model/solicitation/solicitation';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Popover } from './../../../util/popover/popover';
import { ExternalAppProvider } from '../../../providers/external-app/external-app';

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
  public btnActionText = '';
  // tslint:disable-next-line:ban-types
  public btnActionFunction: Function;
  public solicitationStatusClass: string = '';
  public solicitationStatus: string = '';
  public showSolicitationActions: boolean = false;
  public showMenuActions: boolean = false;
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
    public profileProvider: ProfileProvider,
    public extApp: ExternalAppProvider) { }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getSolicitation();
    this.updateSolicitationEvent();
    this.events.subscribe('CHANGE_SOLICITATION', (data: any) => {
      this.solicitationProvider.getSolicitaiton(data)
        .then((res) => {
          this.updateSolicitationByEvent(res);
        });
    });
    this.setMenuVisibility();
  }

  /**
   * @description Build user avatar image.
   * @param imagePath profile image path.
   */
  public setAvatarImage(imagePath: string) {
    let profilePhoto = '';
    if (imagePath) {
      profilePhoto = imagePath;
    } else {
      profilePhoto = '../../../assets/imgs/149071.png';
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('CHANGE_SOLICITATION');
    this.events.unsubscribe('USER_CHANGE_SOLICITATION');
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
      this.btnActionText = 'Aprovar Solicitação';
      this.btnActionFunction = this.acceptSolicitationAction;
      this.showSolicitationActions = true;
    } else if (this.solicitation.status === Constants.SOLICITATION_IS_RUNNING) {
      this.btnActionText = 'Finalizar solicitação';
      this.btnActionFunction = this.finishSolicitationAction;
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
   * @description set solicitation view class by status.
   */
  public setSolicitationStatusClass() {
    let statusClass = ' ';

    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusClass += 'newSolicitation';
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusClass += 'runningSolicitation';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusClass += 'finishedSolicitation';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusClass += 'canceledSolicitation';
        break;
    }

    this.solicitationStatusClass = statusClass;
  }

  /**
   * @description build a string based on solicitation status.
   * @param status solicitation status.
   */
  public setStatusValueToShow(status: string): string {
    let statusValue = '';

    switch (status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusValue += 'Novo';
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusValue += 'Em Andamento';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusValue += 'Finalizado';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusValue += 'Cancelado';
        break;
    }

    return statusValue;
  }

  /**
   * @description finish solicitation alert information.
   */
  public finishSolicitationAction() {
    this.alert.confirmAlert(
      'Finalizar solicitação!',
      'Deseja finalizar esta solicitação?',
      () => {
        this.solicitation.status = Constants.SOLICITATION_IS_FINISHED;
        this.loadingMessage = 'Finalizando serviço...';
        this.toastMessage = 'Serviço finalizado!';
        this.updateSolicitation();
      },
      // tslint:disable-next-line:no-empty
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
        this.solicitation.removedTo.hiredUid = this.userUid;
        this.loadingMessage = 'Removendo solicitação...';
        this.toastMessage = 'Solicitação removida!';
        this.updateSolicitation();
      },
      // tslint:disable-next-line:no-empty
      () => { },
      'Não',
      'Sim',
    );
  }

  /**
   * @description accept solicitation alert information.
   */
  public acceptSolicitationAction() {
    this.alert.confirmAlert(
      'Aceitar solicitação!',
      'Você aceita esta solicitação?',
      () => {
        this.solicitation.status = Constants.SOLICITATION_IS_RUNNING;
        this.loadingMessage = 'Aceitando serviço...';
        this.toastMessage = 'Serviço aceito!';
        this.updateSolicitation();
      },
      // tslint:disable-next-line:no-empty
      () => { },
      'Não',
      'Sim',
    );
  }

  /**
   * @description update solicitation alert information.
   */
  public updateSolicitation() {
    this.loading.showLoading('Atualizando serviço...')
      .then(() => {
        this.solicitation.lastActionByUserUid = this.userUid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.onSuccess();
          })
          .catch(() => {
            this.toast.showToast('Erro ao alterar serviço!');
          });
      });
  }

  /**
   * @description verify avaliation from a solicitation event.
   */
  public verifyAvaliation() {
    if (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED) {
      let alertTitle = '';
      let alertBody = '';
      alertTitle = 'Avalie seu cliente!';
      alertBody = 'Dê a sua opnião sobre ' + this.contractorPf.name.firstName + ', ajudando outros profissionais no Tips!';

      this.alert.confirmAlert(alertTitle,
        alertBody,
        this.avaliation.bind(this),
        () => { this.avaliationPending(); },
        'Depois', 'Agora');
    }
  }

  /**
   * @description enable avaliation option on view.
   */
  public avaliationPending() {
    if (this.solicitation.avaliatedTo.hiredAvaliation == null &&
      (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED)) {
      this.btnActionText = 'Avaliar Cliente';
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
   * @description Open a specific application to make contact with other user.
   * @param app Application name to be open.
   */
  public goToApp(app: string) {
    switch (app) {
      case 'whats':
        this.extApp.openWhatsApp(this.contractorPf.social.whatsapp);
        break;
      case 'face':
        this.extApp.openFacebook(this.contractorPf.social.facebook);
        break;
      case 'inst':
        this.extApp.openInstagram(this.contractorPf.social.instagram);
        break;
      case 'phone':
        const phone = this.contractorPf.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
        this.extApp.openPhoneApp(phone);
        break;
      case 'email':
        this.extApp.openMailApp(this.contractorPf.email);
        break;
      case 'maps':
        const fullAddress = this.contractorPf.street + ' ' + this.contractorPf.houseNumber + ' ' + this.contractorPf.district +
          ' ' + this.contractorPf.city + ' ' + this.contractorPf.state;
        this.extApp.openMapsApp(fullAddress);
        break;
      default:
        break;
    }
  }

  /**
   * @description handle option menu visibility
   */
  private setMenuVisibility() {
    if (this.solicitation.status === Constants.SOLICITATION_IS_OPEN ||
      this.solicitation.status === Constants.SOLICITATION_IS_RUNNING) {
      this.showMenuActions = true;
    } else if (this.solicitation.status === Constants.SOLICITATION_IS_CANCELED) {
      this.showMenuActions = false;
    } else if (!this.solicitation.avaliatedTo.hiredAvaliation &&
      this.solicitation.status === Constants.SOLICITATION_IS_FINISHED) {
      this.showMenuActions = false;
    }
  }

  /**
   * @description update solicitation event from other pages.
   */
  private updateSolicitationByEvent(res: any) {
    this.solicitation = res.data();
    this.buildSolicitationStatusMessage();
    this.setSolicitationStatusClass();
    this.avaliationPending();
    this.setMenuVisibility();
    let toastMessage = '';
    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_RUNNING:
        toastMessage = 'Solicitação aprovada por' + this.contractorPf.name.firstName + '!';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        toastMessage = 'Solicitação cancelada por' + this.contractorPf.name.firstName + '!';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        toastMessage = 'Solicitação finalizada por' + this.contractorPf.name.firstName + '!';
        break;
    }
    this.toast.showToast(toastMessage);
  }

  /**
   * @description update solicitation event .
   */
  private updateSolicitationEvent() {
    this.events.subscribe('USER_CHANGE_SOLICITATION', (serv) => {
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
    this.setSolicitationStatusClass();
    this.setMenuVisibility();
    if (this.solicitation.removedTo.hiredUid === this.userUid) {
      this.navCtrl.pop();
    }
  }

  /**
   * @description request contractor profired.
   */
  private getProfiles() {
    this.hiredPf = { ...AppConfig.USER_PROFILE };
    this.profileProvider.getProfile(this.solicitation.contractorUid)
      .then((res) => {
        this.contractorPf = res.data();
        this.buildSolicitationStatusMessage();
        this.setSolicitationStatusClass();
        this.avaliationPending();
        this.setMenuVisibility();
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
    this.setSolicitationStatusClass();
    this.buildSolicitationStatusMessage();
    this.verifyAvaliation();
    this.setMenuVisibility();
    if (this.solicitation.removedTo.hiredUid === this.userUid) {
      this.navCtrl.pop();
    }
  }
}
