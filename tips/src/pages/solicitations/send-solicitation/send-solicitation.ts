import { ServiceProvider } from './../../../providers/service/service';
import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Solicitation } from '../../../model/solicitation/solicitation';

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
    public solicitationProvider: ServiceProvider) { }

  ionViewWillEnter() {
    this.getProfileToService()
  }

  getProfileToService() {
    this.contractorPf = { ...AppConfig.USER_PROFILE }
    this.hiredPf = this.navParams.get(Constants.SERVICE_PROFILE)
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
      ownerUid: this.contractorPf.uid,
      contractorUid: this.contractorPf.uid,
      hiredUid: this.hiredPf.uid,
      lastActionByUserUid: this.contractorPf.uid,
      avaliationUid: null,
      name: "Solicitação para " + this.hiredPf.nome,
      description: this.solicitationDescription,
      date: date.toLocaleDateString(),
      status: Constants.SERVICE_IS_OPEN,
      isRemoved: false
    }

    this.saveDoubleService(solicitation);
  }

  private saveDoubleService(solicitation: Solicitation) {
    this.loading.showLoading("Solicitando serviço...")
      .then(() => {
        this.solicitationProvider.createService(solicitation)
          .then(async () => {
            solicitation.uId = UUID.UUID();
            solicitation.ownerUid = this.hiredPf.uid;
            solicitation.status = Constants.SERVICE_IS_OPEN;
            solicitation.name = "Solicitação de " + this.contractorPf.nome
            return this.solicitationProvider.createService(solicitation)
              .then(() => {
                this.solicitationDone = true;
                this.loading.hideLoading();
              });
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
