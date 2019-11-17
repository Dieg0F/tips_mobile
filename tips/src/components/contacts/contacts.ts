import { Component, Input } from '@angular/core';
import { Profile } from '../../model/profile/profile';
import { AppConfig } from '../../model/static/static';
import { ExternalAppProvider } from '../../providers/external-app/external-app';

@Component({
  selector: 'contacts',
  templateUrl: 'contacts.html',
})
export class ContactsComponent {

  @Input('profile') public profile: Profile;

  constructor(public extApp: ExternalAppProvider) { }

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
