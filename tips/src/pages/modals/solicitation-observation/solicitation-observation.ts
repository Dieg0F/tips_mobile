import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Solicitation, SolicitationObservation } from '../../../model/solicitation/solicitation';
import { AppConfig } from '../../../model/static/static';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-solicitation-observation',
  templateUrl: 'solicitation-observation.html',
})
export class SolicitationObservationPage {

  public solicitationObs: string = '';
  public solicitation: Solicitation;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public navParams: NavParams,
    public solicitationProvider: SolicitationProvider,
    public events: Events) {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
  }

  /**
   * @description build a Solicitation Observation object and save it on solicitation.
   */
  public finish() {
    const observation: SolicitationObservation = {
      userUid: AppConfig.USER_PROFILE.uid,
      userName: AppConfig.USER_PROFILE.name.firstName + ' ' + AppConfig.USER_PROFILE.name.lastName,
      body: this.solicitationObs,
      cause: Constants.SOLICITATION_IS_CANCELED,
      date: new Date(parseInt(Date.now().toString(), 0)).toLocaleDateString(),
    };
    this.solicitation.observations = new Array<SolicitationObservation>();
    this.solicitation.observations.push(observation);
    this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
    this.updateSolicitation();
  }

  /**
   * @description update solicitation with a new observation.
   */
  public updateSolicitation() {
    this.loading.showLoading('Atualizando solicitação...')
      .then(() => {
        this.solicitation.lastActionByUserUid = AppConfig.USER_PROFILE.uid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast('Solicitação cancelada!');
            this.events.publish('USER_CHANGE_SOLICITATION', this.solicitation);
            this.viewCtrl.dismiss();
          })
          .catch(() => {
            this.toast.showToast('Erro ao alterar solicitação!');
            this.viewCtrl.dismiss();
          });
      });
  }

  /**
   * @description close this modal.
   */
  public cancel() {
    this.viewCtrl.dismiss();
  }
}
