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
    var geo: GeoLocation = {
      lat: this.profile.geoLocation.lat,
      lng: this.profile.geoLocation.lng
    }

    this.map = new GoogleMaps(geo, document.getElementById('map')).buildMap()
  }
}
