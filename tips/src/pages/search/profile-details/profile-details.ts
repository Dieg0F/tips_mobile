import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';

@IonicPage()
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {

  public profile: Profile

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.getProfile()
  }

  ionViewWillEnter() {
    this.getProfile()
  }

  getProfile() {
    this.profile = this.navParams.get('profile')
  }

}
