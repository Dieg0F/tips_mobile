import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { Loading } from '../util/loading/loading';
import { Toast } from '../util/toast/toast';

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
    private storage: StorageProvider) {

    this.platform.ready().then(() => {
      // //Verifica se usuário já está logado
      this.verifyUser()

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

  verifyUser(): any {      
    this.storage.getItem('userAuth')
      .then((result) => {
        console.log('verifyUser: ', result)
        if (result != null) {
          this.rootPage = 'ProfilePage'
          this.toast.showToast('Bem vindo novamente!')
        } else {
          this.rootPage = 'LoginPage'
        }
        this.splashScreen.hide();
      })
      .catch((error) => {
        this.splashScreen.hide();
        this.toast.showToast('Sessão finalizada!')
        console.log('Error: ', error)
      })
  }
}

