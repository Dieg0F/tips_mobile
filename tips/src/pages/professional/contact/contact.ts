import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';
import { GoogleMaps } from '../../../util/google-map/google-map';
import { GeoLocation } from '../../../model/geoLocation/geoLocation';
import { Profile } from '../../../model/profile/profile';

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

  getProfile() {
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE)
  }

  ionViewDidLoad() {
    this.buildMap();
  }

  buildMap() {

    var fullAddress = this.profile.street + " " + this.profile.houseNumber + " " + this.profile.district +
      " " + this.profile.city + " " + this.profile.state;

    this.map = new GoogleMaps(document.getElementById('map')).getLocation(fullAddress);
  }
}
