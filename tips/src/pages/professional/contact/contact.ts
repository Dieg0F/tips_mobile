import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { ExternalAppProvider } from '../../../providers/external-app/external-app';
import { Constants } from '../../../util/constants/constants';
import { GoogleMaps } from '../../../util/google-map/google-map';
import { AppConfig } from '../../../model/static/static';

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
   * @description Open a specific application to make contact with other user.
   * @param app Application name to be open.
   */
  public goToApp(app: string) {
    if (this.profile.uid === AppConfig.USER_PROFILE.uid) {
      return;
    }
    switch (app) {
      case 'whats':
        this.extApp.openWhatsApp(this.profile.social.whatsapp);
        break;
      case 'face':
        this.extApp.openInstagram(this.profile.social.facebook);
        break;
      case 'inst':
        this.extApp.openInstagram(this.profile.social.instagram);
        break;
      case 'phone':
        const phone = this.profile.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
        this.extApp.openPhoneApp(phone);
        break;
      case 'email':
        this.extApp.openMailApp(this.profile.email);
        break;
      default:
        break;
    }
  }
}
