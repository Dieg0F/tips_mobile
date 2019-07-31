import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Loading } from '../../../util/loading/loading';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { Profile } from '../../../model/profile/profile';

@IonicPage()
@Component({
  selector: 'page-avaliation-details',
  templateUrl: 'avaliation-details.html',
})
export class AvaliationDetailsPage {

  private avaliation: Avaliation
  private avaliationOwner: Profile

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public profileProvider: ProfileProvider) {
    this.getAvaliation();
  }

  ionViewWillEnter() {
    this.getAvaliation();
  }

  async getAvaliation() {
    this.avaliation = this.navParams.get('avaliation');
    this.avaliationOwner = this.navParams.get('avaliationOwner');
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

}
