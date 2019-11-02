import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { ExternalAppProvider } from '../../../providers/external-app/external-app';
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
    public navParams: NavParams,
    public extApp: ExternalAppProvider) {
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

  /**
   * @description Open a specific application to make contact with other user.
   * @param app Application name to be open.
   */
  public goToApp(app: string) {
    switch (app) {
      case 'whats':
        this.extApp.openWhatsApp(this.profile.social.whatsapp);
        break;
      case 'face':
        this.extApp.openFacebook(this.profile.social.facebook);
        break;
      case 'inst':
        this.extApp.openPhoneApp(this.profile.social.instagram);
        break;
      case 'phone':
        const phone = this.profile.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
        this.extApp.openPhoneApp(phone);
        break;
      case 'email':
        this.extApp.openMailApp(this.profile.email);
        break;
      case 'maps':
        const fullAddress = this.profile.street + ' ' + this.profile.houseNumber + ' ' + this.profile.district +
          ' ' + this.profile.city + ' ' + this.profile.state;
        this.extApp.openMapsApp(fullAddress);
        break;
      default:
        break;
    }
  }
}
