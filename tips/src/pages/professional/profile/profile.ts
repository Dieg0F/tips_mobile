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

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public navParams: NavParams) {
  }

  ionViewWillEnter() {
    var elm = document.getElementById('img_profile');
    elm.style.backgroundImage = "url('" + AppConfig.USER_PROFILE.profilePhotoUrl + "')";
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

  search() {
    this.navCtrl.push("SearchPage");
  }

  rating() {
    this.navCtrl.push("UserAvaliationsPage");
  }
}
