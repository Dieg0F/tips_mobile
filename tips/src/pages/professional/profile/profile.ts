import { Alert } from './../../../util/alert/alert';
import { Constants } from './../../../util/constants/constants';
import { ServiceProvider } from './../../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {

  public profile = { ...AppConfig.USER_PROFILE }

  public greetingMesage = "";

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public serviceProvider: ServiceProvider,
    public alert: Alert,
    public navParams: NavParams) { }

  ionViewWillEnter() {
    this.greetingMessageBuilder();
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

  contact() {
    this.navCtrl.push("ContactPage", { 'userProfile': this.profile });
  }

  search() {
    this.navCtrl.push("SearchPage");
  }

  rating() {
    this.navCtrl.push("UserAvaliationsPage");
  }

  serviceManager() {
    this.serviceProvider.getServices(this.profile.uid)
      .then((res) => {
        res.subscribe((values) => {
          var hasServicePending = false

          values.forEach(element => {
            if ((element.status == Constants.SERVICE_IS_OPEN ||
              element.status == Constants.SERVICE_IS_AWAIT_TO_CANCEL ||
              element.status == Constants.SERVICE_IS_AWAIT_TO_FINISH) &&
              (element.lastActionByUserUid != this.profile.uid) &&
              (element.ownerUid == this.profile.uid)) {
              hasServicePending = true
            }
          });

          if (hasServicePending) {
            this.alert.confirmAlert(
              "Serviços pendentes!",
              "Você possui serviços aguardando sua ação!",
              () => { this.navCtrl.push("UserServicesPage"); },
              () => { }, "Depois", "Ver Serviços")
          }
        })
      })
  }

  greetingMessageBuilder() {
    var date = new Date()
    var hours = date.getHours();

    if (hours >= 0 && hours < 5) {
      this.greetingMesage = "Boa madrugada, ";
    } else if (hours >= 5 && hours <= 12) {
      this.greetingMesage = "Bom dia, ";
    } else if (hours > 13 && hours <= 18) {
      this.greetingMesage = "Boa tarde, ";
    } else if (hours > 18 && hours < 24) {
      this.greetingMesage = "Boa noite, ";
    }
  }
}
