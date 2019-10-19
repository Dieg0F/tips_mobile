import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController } from 'ionic-angular';
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
    this.starsRateHelper = new StarRateHelper();
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    return this.starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    return this.starsRateHelper.starsRateColor(value);
  }

  /**
   * @description close this modal and emit selected rated event.
   */
  public finish() {
    this.events.publish('rateSelected', this.rateSelected);
    this.viewCtrl.dismiss();
  }

  /**
   * @description close this modal and emit empty rated event.
   */
  public cancel() {
    this.events.publish('rateSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
