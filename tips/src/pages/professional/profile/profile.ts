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
  private starsRateHelper: StarRateHelper

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public navParams: NavParams) {
    this.starsRateHelper = new StarRateHelper
  }

  ionViewWillEnter() {
    var elm = document.getElementById('img_profile');
    elm.style.backgroundImage = "url('" + AppConfig.USER_PROFILE.profilePhotoUrl + "')";

    console.log(this.profile)
  }

  starsRate(value: number): Array<String> {
    return this.starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    return this.starsRateHelper.starsRateColor(value)
  }

  search() {
    this.navCtrl.push("SearchPage");
  }

  ranking() {
    this.navCtrl.push("ProfileAvaliationsPage");
  }

  rating() {
    this.navCtrl.push("ProfileAvaliationsPage");
  }
}
