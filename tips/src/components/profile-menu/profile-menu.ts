import { Component } from '@angular/core';
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

  /**
   * @description redirect user to profile configuration page.
   */
  public editProfile(): void {
    this.navCtrl.push('MyAccountPage');
  }

  /**
   * @description logout user from application, clear all data and redirect to login page.
   */
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

  /**
   * @description redirect user to avaliations page.
   */
  public rating() {
    this.navCtrl.push('UserAvaliationsPage');
  }

  /**
   * @description redirect user to solicitation page.
   */
  public services() {
    this.navCtrl.push('UserSolicitationsPage');
  }

  /**
   * @description redirect user to configurations page.
   */
  public configs() {
    this.navCtrl.push('AppConfigPage');
  }

  /**
   * @description redirect user to login page.
   */
  private goToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
    this.loading.hideLoading();
    this.toast.showToast('Desconectado com sucesso!');
  }
}
