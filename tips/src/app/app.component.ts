import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '../util/toast/toast';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AppConfig } from '../model/static/static';
import { Notifications } from '../util/notifications/notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private toast: Toast,
    private notifications: Notifications,
    private appConfigProvider: AppConfigProvider) {
    console.log(Date.now())
    console.log(new Date(Date.now()).toTimeString())
    console.log(new Date(Date.now()).toLocaleDateString())
    console.log(new Date(Date.now()).getUTCDate())
    console.log(new Date(Date.now()).getUTCDay())
    console.log(new Date(Date.now()).getUTCMonth())
    console.log(new Date(Date.now()).getUTCFullYear())
    this.platform.ready()
      .then(async () => {
        this.verifyUser();
        this.disabledTextZoom();
        this.statusBar.backgroundColorByHexString("#273A56");
        this.statusBar.styleLightContent();

        /// Remove this row below to run applciaiton on web browser.                      
        //this.notifications.initService();
        /// Remove ^^^^^^^^^^^^^^^^^^^^
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
        if (AppConfig.USER_PROFILE != undefined) {
          this.rootPage = "ProfilePage"
          this.toast.showToast('Bem vindo novamente!');
        } else {
          this.rootPage = "LoginPage"
        }
      })
      .catch(() => {
        this.rootPage = "LoginPage"
      })
  }
}

