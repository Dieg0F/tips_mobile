import { Component } from '@angular/core';
import {AngularFireAuth } from '@angular/fire/auth';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth) {
    platform.ready().then(() => {
      //Verifica se usuário já está logado
      afAuth.auth.onAuthStateChanged((_user) => {
        if(_user != null) { //Logado
          this.rootPage = "ProfilePage";
          console.log('logado');
        } else { //não logado
          this.rootPage = "LoginPage";
          console.log('não logado, faça login ou cadastre-se');
        }
      })

      if ('MobileAccessibility' in window) {
        const { MobileAccessibility }: any = window;
        MobileAccessibility.usePreferredTextZoom(false);
      }
      this.disabledTextZoom()
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString("#273A56");
      statusBar.styleLightContent();

      splashScreen.hide();
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
}

