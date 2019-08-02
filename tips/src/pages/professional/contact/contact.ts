import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  public profile: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.getProfile()
  }

  getProfile() {
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE)
  }

}
