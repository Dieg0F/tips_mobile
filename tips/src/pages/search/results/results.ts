import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';


@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  private profiles = []
  private starsRateHelper: StarRateHelper

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider) {
    this.starsRateHelper = new StarRateHelper
  }

  ionViewWillEnter() {
    this.getParams()
  }

  starsRate(value: number): Array<String> {
    return this.starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    return this.starsRateHelper.starsRateColor(value)
  }

  getParams() {
    this.profiles = this.navParams.get('profiles')
  }

  goToDetails(profile: any) {
    this.navCtrl.push("ProfileDetailsPage", { 'profile': profile })
  }

  searchAgain() {
    this.navCtrl.push("SearchModalPage", { 'filterOptions': this.navParams.get('filterOptions') })
  }
}
