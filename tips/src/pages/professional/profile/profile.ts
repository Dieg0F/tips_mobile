import { Toast } from './../../../util/toast/toast';
import { Alert } from './../../../util/alert/alert';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
    public alert: Alert,
    public toast: Toast,
    public events: Events,
    public navParams: NavParams) { }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    console.log("Profiles: ", this.profile, AppConfig.USER_PROFILE);
    this.profile = { ...AppConfig.USER_PROFILE };
    this.greetingMessageBuilder();
    this.events.unsubscribe("CHANGE_PROFILE_RATING");
    this.events.subscribe("CHANGE_PROFILE_RATING", () => {
      this.profileProvider.getProfile(this.profile.uid)
        .then((res) => {
          console.log("Profile: ", res.data());
          return this.profileProvider.saveProfileOnStorage(res.data())
            .then(() => {
              this.profile = { ...AppConfig.USER_PROFILE }
            });
        })
    })
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad");
    console.log("Profiles: ", this.profile, AppConfig.USER_PROFILE);
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper;
    return starsRateHelper.starsRate(value);
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper;
    return starsRateHelper.starsRateColor(value);
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

  greetingMessageBuilder() {
    var date = new Date();
    var hours = date.getHours();

    if (hours >= 0 && hours < 5) {
      this.greetingMesage = "Boa madrugada, ";
    } else if (hours >= 5 && hours <= 12) {
      this.greetingMesage = "Bom dia, ";
    } else if (hours >= 13 && hours <= 18) {
      this.greetingMesage = "Boa tarde, ";
    } else if (hours > 18 && hours < 24) {
      this.greetingMesage = "Boa noite, ";
    }
  }
}
