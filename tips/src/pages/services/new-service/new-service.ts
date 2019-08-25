import { ServiceProvider } from './../../../providers/service/service';
import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { Service } from '../../../model/service/service';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-new-service',
  templateUrl: 'new-service.html',
})
export class NewServicePage {

  public serviceorProfile: Profile
  public hiredProfile: Profile
  public serviceConfirmed: boolean = false
  public service: Service

  public serviceName = "";
  public serviceDesctiption = "";

  public describeService: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serviceProvider: ServiceProvider) { }

  ionViewWillEnter() {
    this.getProfileToService()
  }

  getProfileToService() {
    this.serviceorProfile = { ...AppConfig.USER_PROFILE }
    this.hiredProfile = this.navParams.get(Constants.SERVICE_PROFILE)
  }

  makeService() {
    setTimeout(() => {
      this.serviceConfirmed = true;
      this.describeService = false;
      this.serviceUser()
    }, 2000)
  }

  serviceUser() {
    var date: Date = new Date()
    let service: Service = {
      uId: UUID.UUID(),
      serviceId: UUID.UUID(),
      ownerUid: this.serviceorProfile.uid,
      serviceorUid: this.serviceorProfile.uid,
      hiredUid: this.hiredProfile.uid,
      lastActionByUserUid: this.serviceorProfile.uid,
      name: this.serviceName,
      description: this.serviceDesctiption,
      date: date.toLocaleDateString(),
      status: Constants.SERVICE_IS_OPEN,
      isRemoved: false
    }

    this.saveDoubleService(service);
  }

  private saveDoubleService(service: Service) {
    this.serviceProvider.createService(service)
      .then(() => {
        service.uId = UUID.UUID();
        service.ownerUid = this.hiredProfile.uid;
        service.status = Constants.SERVICE_IS_OPEN;
        return this.serviceProvider.createService(service)
          .then(() => {
            this.serviceConfirmed = true;
          });
      })
      .catch((err) => {
        console.log(err);
        this.serviceConfirmed = false;
      });
  }

  setServiceDescription() {
    this.describeService = true;
  }

  backToMyProfile() {
    this.navCtrl.setRoot("ProfilePage");
  }
}
