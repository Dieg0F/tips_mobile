import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ExternalAppProvider } from '../../providers/external-app/external-app';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
