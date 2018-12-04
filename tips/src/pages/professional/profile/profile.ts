import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProfilePage");
  }

  menu() {
    //TODO Menu popup
  }

  search() {
    this.navCtrl.push("SearchPage");
  }

  ranking() {
    this.navCtrl.push("RankingPage");
  }

  rating() {
    this.navCtrl.push("RatingPage");
  }
}
