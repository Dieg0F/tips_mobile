import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {

  public profile: Profile
  private starsRateHelper: StarRateHelper

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.starsRateHelper = new StarRateHelper
    this.getProfile()
  }

  ionViewWillEnter() {
    this.getProfile()
  }

  getProfile() {
    this.profile = this.navParams.get('profile')
  }

  starsRate(value: number): Array<String> {
    return this.starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    return this.starsRateHelper.starsRateColor(value)
  }
}
