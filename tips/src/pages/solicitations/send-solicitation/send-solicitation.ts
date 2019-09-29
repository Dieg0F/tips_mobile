import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';

@IonicPage()
@Component({
  selector: 'page-send-solicitation',
  templateUrl: 'send-solicitation.html',
})
export class SendSolicitationPage {

  public contractorPf: Profile
  public hiredPf: Profile
  public solicitationDone: boolean = false
  public solicitation: Solicitation

  public solicitationName = "";
  public solicitationDescription = "";

  public enableDescription: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public solicitationProvider: SolicitationProvider) { }

  ionViewWillEnter() {
    this.getProfileToService()
  }

  getProfileToService() {
    this.contractorPf = { ...AppConfig.USER_PROFILE }
    this.hiredPf = this.navParams.get(Constants.SOLICITATION_PROFILE)
  }

  makeService() {
    this.solicitationDone = true;
    this.enableDescription = false;
    this.solicitationUser();
  }

  solicitationUser() {
    var date: Date = new Date()
    let solicitation: Solicitation = {
      uId: UUID.UUID(),
      solicitationId: UUID.UUID(),
      contractorUid: this.contractorPf.uid,
      hiredUid: this.hiredPf.uid,
      lastActionByUserUid: this.contractorPf.uid,
      name: this.hiredPf.name.firstName + " " + this.hiredPf.name.lastName,
      description: this.solicitationDescription,
      observations: null,
      date: date.toLocaleDateString(),
      status: Constants.SOLICITATION_IS_OPEN,
      removedTo: {
        contractorUid: null,
        hiredUid: null,
      },
      avaliatedTo: {
        contractorAvaliation: null,
        hiredAvaliation: null,
      }
    }

    this.saveDoubleService(solicitation);
  }

  private saveDoubleService(solicitation: Solicitation) {
    this.loading.showLoading("Solicitando serviço...")
      .then(() => {
        this.solicitationProvider.createSolicitation(solicitation)
          .then(async () => {
            this.solicitationDone = true;
            this.loading.hideLoading();
          })
          .catch((err) => {
            console.log(err);
            this.solicitationDone = false;
            this.loading.hideLoading();
          });
      })
      .catch(() => {
        console.log("Error: NewServicePage, Loading")
      })
  }

  setServiceDescription() {
    this.enableDescription = true;
  }

  backToMyProfile() {
    this.navCtrl.setRoot("ProfilePage");
  }
}
