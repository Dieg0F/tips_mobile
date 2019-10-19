import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Solicitation } from './../../../model/solicitation/solicitation';
import { AvaliationProvider } from './../../../providers/avaliation/avaliation';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-solicitation-options',
  templateUrl: 'solicitation-options.html',
})
export class SolicitationOptionsPage {

  public solicitation: Solicitation;
  public solicitationFinishedStatus = Constants.SOLICITATION_IS_FINISHED;
  public userUid = AppConfig.USER_PROFILE.uid;
  public loadingMessage = '';
  public toastMessage = '';
  public removeAction: boolean = false;
  public cancelAction: boolean = false;
  public asContractor: boolean = true;
  private userCloseThisModal: boolean = true;

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

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);

    if (this.solicitation.contractorUid === this.userUid) {
      this.asContractor = true;
    } else {
      this.asContractor = false;
    }

    this.setButtons();
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    if (this.userCloseThisModal) { this.events.unsubscribe('USER_CHANGE_SOLICITATION'); }
  }

  /**
   * @description handle buttons that will be displayed.
   */
  public setButtons() {
    if (this.solicitation.status === Constants.SOLICITATION_IS_FINISHED ||
      this.solicitation.status === Constants.SOLICITATION_IS_CANCELED) {
      this.removeAction = true;
      this.cancelAction = false;
    }
    if (this.solicitation.status === Constants.SOLICITATION_IS_RUNNING) {
      this.cancelAction = true;
      this.removeAction = false;
    }
    if (this.solicitation.status === Constants.SOLICITATION_IS_OPEN) {
      this.cancelAction = true;
      this.removeAction = false;
    }
  }

  /**
   * @description cancel solicitation alert information.
   */
  public cancelSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          'Cancelar solicitação',
          'Tem certeza que deseja cancelar esta solicitação?',
          this.cancelSolicitation.bind(this),
          // tslint:disable-next-line:no-empty
          () => { });
      });
  }

  /**
   * @description remove solicitation alert information.
   */
  public removeSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          'Remover solicitação',
          'Tem certeza que deseja remover esta solicitação?',
          this.removeSolicitation.bind(this),
          // tslint:disable-next-line:no-empty
          () => { });
      });
  }

  /**
   * @description finish solicitation alert information.
   */
  public finishSolicitationAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          'Finalizar solicitação',
          'Tem certeza que deseja finalizar esta solicitação?',
          this.finishSolicitation.bind(this),
          // tslint:disable-next-line:no-empty
          () => { });
      });
  }

  /**
   * @description apply finish solicitation changes.
   */
  public finishSolicitation() {
    this.solicitation.status = Constants.SOLICITATION_IS_FINISHED;
    this.loadingMessage = 'Finalizando solicitação...';
    this.toastMessage = 'Solicitação finalizado!';
    this.updateSolicitation();
  }

  /**
   * @description apply cancel solicitation changes.
   */
  public cancelSolicitation() {
    if (this.asContractor &&
      this.solicitation.status === Constants.SOLICITATION_IS_OPEN) {
      this.solicitation.removedTo.hiredUid = this.solicitation.hiredUid;
    }
    this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
    this.loadingMessage = 'Cancelando solicitação...';
    this.toastMessage = 'Solicitação cancelado!';
    this.navCtrl.push('SolicitationObservationPage', { solicitation: this.solicitation });
  }

  /**
   * @description apply remove solicitation changes.
   */
  public removeSolicitation() {
    if (this.asContractor) {
      this.solicitation.removedTo.contractorUid = this.userUid;
    } else {
      this.solicitation.removedTo.hiredUid = this.userUid;
    }
    this.loadingMessage = 'Removendo solicitação...';
    this.toastMessage = 'Solicitação removido!';
    this.updateSolicitation();
  }

  /**
   * @description update solicitation on database.
   */
  public async updateSolicitation() {
    this.solicitation.lastActionByUserUid = this.userUid;
    await this.loading.showLoading(this.loadingMessage)
      .then(async () => {
        return await this.serviceProvider.updateSolicitation(this.solicitation)
          .then(async () => {
            this.success();
          });
      })
      .catch((err) => {
        this.error();
      });
  }

  /**
   * @description handle solicitation success messages and start solicitation update event.
   */
  public success() {
    try {
      this.loading.hideLoading();
      this.toast.showToast(this.toastMessage);
      this.events.publish('USER_CHANGE_SOLICITATION', this.solicitation);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log('Error: SolicitationOptionsPage, Loading Hide');
      // tslint:disable-next-line:no-console
      console.log('Error: ', error);
    }
  }

  /**
   * @description handle solicitation error messages.
   */
  public error() {
    this.loading.hideLoadingPromise()
      .then(() => {
        return this.toast.showToast('Erro ao atualizar o status do serviço.');
      });
  }

  /**
   * @description close this popup.
   */
  public close(): Promise<any> {
    this.userCloseThisModal = false;
    return this.viewCtrl.dismiss();
  }
}
