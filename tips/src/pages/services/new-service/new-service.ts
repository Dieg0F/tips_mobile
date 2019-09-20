import { ServiceProvider } from './../../../providers/service/service';
import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { Service } from '../../../model/service/service';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';

@IonicPage()
@Component({
  selector: 'page-new-service',
  templateUrl: 'new-service.html',
})
export class NewServicePage {

  public contractorProfile: Profile
  public hiredProfile: Profile
  public serviceConfirmed: boolean = false
  public service: Service

  public serviceName = "";
  public serviceDesctiption = "";

  public describeService: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public serviceProvider: ServiceProvider) { }

  ionViewWillEnter() {
    this.getProfileToService()
  }

  getProfileToService() {
    this.contractorProfile = { ...AppConfig.USER_PROFILE }
    this.hiredProfile = this.navParams.get(Constants.SERVICE_PROFILE)
  }

  makeService() {
    this.serviceConfirmed = true;
    this.describeService = false;
    this.serviceUser();
  }

  serviceUser() {
    var date: Date = new Date()
    let service: Service = {
      uId: UUID.UUID(),
      serviceId: UUID.UUID(),
      ownerUid: this.contractorProfile.uid,
      contractorUid: this.contractorProfile.uid,
      hiredUid: this.hiredProfile.uid,
      lastActionByUserUid: this.contractorProfile.uid,
      avaliationUid: null,
      name: "Solicitação de " + this.contractorProfile.nome,
      description: this.serviceDesctiption,
      date: date.toLocaleDateString(),
      status: Constants.SERVICE_IS_OPEN,
      isRemoved: false
    }

    this.saveDoubleService(service);
  }

  private saveDoubleService(service: Service) {
    this.loading.showLoading("Solicitando serviço...")
      .then(() => {
        this.serviceProvider.createService(service)
          .then(async () => {
            service.uId = UUID.UUID();
            service.ownerUid = this.hiredProfile.uid;
            service.status = Constants.SERVICE_IS_OPEN;
            return this.serviceProvider.createService(service)
              .then(() => {
                this.serviceConfirmed = true;
                this.loading.hideLoading();
              });
          })
          .catch((err) => {
            console.log(err);
            this.serviceConfirmed = false;
            this.loading.hideLoading();
          });
      })
      .catch(() => {
        console.log("Error: NewServicePage, Loading")
      })
  }

  setServiceDescription() {
    this.describeService = true;
  }

  backToMyProfile() {
    this.navCtrl.setRoot("ProfilePage");
  }
}
