import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { Constants } from '../../../util/constants/constants';
import { GoogleMaps } from '../../../util/google-map/google-map';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  public profile: Profile;
  public map: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.getProfile();
  }

  /**
   * @description get profile from params.
   */
  public getProfile() {
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE);
  }

  /**
   * @description on page has loaded.
   */
  public ionViewDidLoad() {
    this.buildMap();
  }

  /**
   * @description build Google Maps map.
   */
  public buildMap() {

    const fullAddress = this.profile.street + ' ' + this.profile.houseNumber + ' ' + this.profile.district +
      ' ' + this.profile.city + ' ' + this.profile.state;

    this.map = new GoogleMaps(document.getElementById('map')).getLocation(fullAddress);
  }
}
