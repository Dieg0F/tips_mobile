import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Locations } from '../../../providers/locations/locations';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { Solicitation, SolicitationObservation } from '../../../model/solicitation/solicitation';
import { Constants } from '../../../util/constants/constants';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-solicitation-observation',
  templateUrl: 'solicitation-observation.html',
})
export class SolicitationObservationPage {

  public solicitationObs: string = "";
  public solicitation: Solicitation;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public locations: Locations,
    public navParams: NavParams,
    public solicitationProvider: SolicitationProvider,
    public events: Events) {
    this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);
  }

  finish() {
    let observation: SolicitationObservation = {
      userUid: AppConfig.USER_PROFILE.uid,
      userName: AppConfig.USER_PROFILE.name.firstName + " " + AppConfig.USER_PROFILE.name.lastName,
      body: this.solicitationObs,
      cause: Constants.SOLICITATION_IS_CANCELED,
      date: new Date(parseInt(Date.now().toString())).toLocaleDateString()
    };
    this.solicitation.observations = new Array<SolicitationObservation>();
    this.solicitation.observations.push(observation);
    this.solicitation.status = Constants.SOLICITATION_IS_CANCELED;
    this.updateSolicitation();
  }

  updateSolicitation() {
    this.loading.showLoading("Atualizando solicitação...")
      .then(() => {
        this.solicitation.lastActionByUserUid = AppConfig.USER_PROFILE.uid;
        this.solicitationProvider.updateSolicitation(this.solicitation)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast("Solicitação cancelada!");
            this.events.publish("USER_CHANGE_SOLICITATION", this.solicitation);
            this.viewCtrl.dismiss();
          })
          .catch(() => {
            this.toast.showToast("Erro ao alterar solicitação!");
            this.viewCtrl.dismiss();
          })
      })
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
