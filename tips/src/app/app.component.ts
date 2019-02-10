import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { Loading } from '../util/loading/loading';
import { Toast } from '../util/toast/toast';
import { AppConfigProvider } from '../providers/app-config/app-config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = null;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private loading: Loading,
    private toast: Toast,
    private appConfigProvider: AppConfigProvider) {

    this.platform.ready().then(async () => {
      // //Verifica se usuário já está logado
      await this.verifyUser()

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
    this.rootPage = 'LoginPage';
    if (await this.appConfigProvider.verifyAuth()) {
      this.rootPage = 'ProfilePage';
      this.toast.showToast('Bem vindo novamente!');
    } else {
      this.rootPage = 'LoginPage';
    }
    this.splashScreen.hide();
  }
}

