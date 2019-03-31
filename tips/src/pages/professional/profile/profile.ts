import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';

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
    public navParams: NavParams) { }

  ionViewWillEnter() {
    var elm = document.getElementById('img_profile');
    elm.style.backgroundImage = "url('" + AppConfig.USER_PROFILE.profilePhotoUrl + "')";
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
