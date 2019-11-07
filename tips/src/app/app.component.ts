import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { AppConfig } from '../model/static/static';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { ProfileProvider } from '../providers/profile/profile';
import { StorageProvider } from '../providers/storage/storage';
import { Notifications } from '../util/notifications/notifications';
import { Toast } from '../util/toast/toast';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  public rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private toast: Toast,
    private storage: StorageProvider,
    private notifications: Notifications,
    private profileProvider: ProfileProvider,
    private appConfigProvider: AppConfigProvider) {
    this.platform.ready()
      .then(async () => {
        // this.rootPage = 'AboutPage';
        // tslint:disable-next-line:comment-format
        this.verifyUser();
        this.statusBar.backgroundColorByHexString('#273A56');
        this.statusBar.styleLightContent();

        // tslint:disable-next-line:comment-format
        //this.notifications.initService();
      });
  }

  /**
   * @description Remove device zoom.
   */
  public disabledTextZoom() {
    if ('MobileAccessibility' in window) {
      const { MobileAccessibility }: any = window;
      MobileAccessibility.usePreferredTextZoom(false);
    }
  }

  /**
   * @description verify if has a user autenticated.
   */
  public async verifyUser() {
    this.appConfigProvider.verifyAuth()
      .then(() => {
        if (AppConfig.USER_PROFILE !== undefined) {
          this.profileProvider.getProfile(AppConfig.USER_PROFILE.uid)
            .then(async (res: any) => {
              return this.profileProvider.saveProfileOnStorage(res.data())
                .then(() => {
                  this.storage.getItem('ACCOUNT_STATUS')
                    .then((res) => {
                      if (JSON.parse(res) === 'ACCOUNT_IS_CREATING') {
                        this.rootPage = 'MyAccountPage';
                      } else {
                        this.rootPage = 'ProfilePage';
                        this.toast.showToast('Bem vindo novamente!');
                        this.profileProvider.updateProfile();
                      }
                    });
                });
            });
        } else {
          this.rootPage = 'LoginPage';
        }
      })
      .catch(() => {
        this.rootPage = 'LoginPage';
      });
  }
}
