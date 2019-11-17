import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { ExternalAppProvider } from '../../providers/external-app/external-app';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(private extApp: ExternalAppProvider) { }

  /**
   * @description Open a specific application to make contact with other user.
   * @param app Application name to be open.
   */
  public goToApp(app: string) {
    switch (app) {
      case 'face':
        this.extApp.openFacebook('tips.servicos');
        break;
      case 'inst':
        this.extApp.openInstagram('tips.servicos');
        break;
      case 'email':
        this.extApp.openMailApp('tips.applications@gmail.com');
        break;
    }
  }

}
