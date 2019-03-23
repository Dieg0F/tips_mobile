import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { Loading } from '../util/loading/loading';
import { Toast } from '../util/toast/toast';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AppConfig } from '../model/static/static';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private toast: Toast,
    private appConfigProvider: AppConfigProvider) {      
      this.platform.ready().then(async () => {
        this.verifyUser();
        this.disabledTextZoom()
      this.statusBar.backgroundColorByHexString("#273A56");
      this.statusBar.styleLightContent();
    });
  }

  /**
	 * disabled text zoom
	 */
  disabledTextZoom() {
    if ('MobileAccessibility' in window) {
      const { MobileAccessibility }: any = window;
      MobileAccessibility.usePreferredTextZoom(false);
    }
  }

  async verifyUser() {
    this.appConfigProvider.verifyAuth()
    .then(() => {
      if (AppConfig.USER.uid === AppConfig.USER_AUTH.uid && 
        AppConfig.USER_AUTH.uid === AppConfig.USER_PROFILE.uid) {
        this.rootPage = "ProfilePage"
        this.toast.showToast('Bem vindo novamente!');
      }           
    })
    .catch(() => {
      this.rootPage = "Login"
    })
  }
}

