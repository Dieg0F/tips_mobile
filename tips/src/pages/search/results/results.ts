import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Observable } from 'rxjs';
import { Profile } from '../../../model/profile/profile';


@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  private profiles = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider) {

  }

  ionViewWillEnter() {
    this.getParams()
  }


  getParams() {
    this.profiles = this.navParams.get('profiles')
  }

  starsRate(value: number) {

    var array = new Array<String>()
    var style = ""


    for (let i = 1; i <= 5; i++) {
      if (i <= value) {
        array.push('star')
      } else {
        array.push('star-outline')
      }
    }

    array.push(style)

    return array
  }

  starsRateColor(value: number) {
    var style = ""

    if (value == 0) {
      style = "grey"
    } else if (value > 0 && value < 2) {
      style = "bronze"
    } else if (value >= 2 && value < 4) {
      style = "silver"
    } else if (value >= 4) {
      style = "gold"
    }


    return style;
  }

}
