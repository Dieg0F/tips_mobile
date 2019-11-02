import { Component } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-launcher-app',
  templateUrl: 'launcher-app.html',
})
export class LauncherAppPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public appAvailability: AppAvailability) {
  }

  public launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, username: string) {
    let app: string;
    if (this.platform.is('ios')) {
      app = iosSchemaName;
    } else if (this.platform.is('android')) {
      app = androidPackageName;
    } else {
      const browser = new InAppBrowser().create(httpUrl + username, '_system');
      return;
    }

    this.appAvailability.check(app).then(
      () => { // success callback
        const browser = new InAppBrowser().create(appUrl + username, '_system');
      },
      () => { // error callback
        const browser = new InAppBrowser().create(httpUrl + username, '_system');
      },
    );
  }

  public openInstagram(username: string) {
    this.launchExternalApp('instagram://', 'com.instagram.android', 'instagram://user?username=',
      'https://www.instagram.com/', 'dfoliveira');
  }

  public openFacebook(username: string) {
    this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', 'vander.fraga');
  }

  public openWhatsApp(username: string) {
    this.launchExternalApp('whatsapp://', 'com.whatsapp', 'whatsapp://send?phone=', 'https://web.whatsapp.com//', '+5535999007246');
  }
}
