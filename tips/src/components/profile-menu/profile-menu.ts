import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { Alert } from '../../util/alert/alert';
import { Toast } from '../../util/toast/toast';
import { Loading } from '../../util/loading/loading';
import { AppConfig } from '../../model/static/static';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent implements OnInit {

  public profile = { ...AppConfig.USER_PROFILE }

  constructor(
    public afAuth: AuthProvider,
    public navCtrl: NavController,
    public alert: Alert,
    public loading: Loading,
    public toast: Toast,
    public storage: StorageProvider) { }

  editProfile(): void {
    this.navCtrl.push("MyAccountPage")
  }

  logout(): void {
    this.loading.showLoading('Desconectando sua conta...')
    this.afAuth.logout()
      .then(async (result) => {
        return this.storage.clearAll()
          .then(() => {
            this.goToLoginPage()
          })
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao desconectar a sua conta!')
      })
  }

  private goToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    this.toast.showToast('Desconectado com sucesso!');
  }

  ngOnInit() {
    var elm = document.getElementById('menu_img_profile');
    elm.style.backgroundImage = "url('" + this.profile.profilePhotoUrl + "')";
  }

  rating() {
    this.navCtrl.push("UserAvaliationsPage");
  }

  contracts() {
    this.navCtrl.push("UserServicesPage");
  }

  configs() {
    this.navCtrl.push("AppConfigPage");
  }
}
