import { Component } from '@angular/core';
import { IonicPage, NavParams, Events, ViewController } from 'ionic-angular';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: 'page-rating-search',
  templateUrl: 'rating-search.html',
})
export class RatingSearchPage {

  public starsRateHelper: StarRateHelper;
  public rateSelected: number;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public events: Events) {
    this.starsRateHelper = new StarRateHelper;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingSearchPage');
  }

  starsRate(value: number): Array<String> {
    return this.starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    return this.starsRateHelper.starsRateColor(value)
  }

  finish() {
    this.events.publish('rateSelected', this.rateSelected);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.events.publish('rateSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
