import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  public profile: Profile;
  public map: any;

  constructor(public navParams: NavParams) {
    this.getProfile();
  }

  /**
   * @description get profile from params.
   */
  public getProfile() {
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE);
  }
}
