import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig } from '../../model/static/static';
import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { Alert } from '../../util/alert/alert';
import { Loading } from '../../util/loading/loading';
import { Toast } from '../../util/toast/toast';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html',
})
export class ProfileMenuComponent {

  public profile = { ...AppConfig.USER_PROFILE };

  constructor(
    public afAuth: AuthProvider,
    public navCtrl: NavController,
    public alert: Alert,
    public loading: Loading,
    public toast: Toast,
    public storage: StorageProvider) { }

  public editProfile(): void {
    this.navCtrl.push('MyAccountPage');
  }

  public logout(): void {
    this.loading.showLoading('Desconectando sua conta...');
    this.afAuth.logout()
      .then(async (result) => {
        return this.storage.clearAll()
          .then(() => {
            this.goToLoginPage();
          });
      })
      .catch((error) => {
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao desconectar a sua conta!');
      });
  }

  public rating() {
    this.navCtrl.push('UserAvaliationsPage');
  }

  public services() {
    this.navCtrl.push('UserSolicitationsPage');
  }

  public configs() {
    this.navCtrl.push('AppConfigPage');
  }

  private goToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
    this.loading.hideLoading();
    this.toast.showToast('Desconectado com sucesso!');
  }
}
