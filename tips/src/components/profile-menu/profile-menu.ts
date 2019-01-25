import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { Alert } from '../../util/alert/alert';
import { Toast } from '../../util/toast/toast';
import { Loading } from '../../util/loading/loading';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent {

  text: string;

  constructor(
    public afAuth: AuthProvider,
    public navCtrl: NavController,
    public alert: Alert,
    public loading: Loading,
    public toast: Toast,
    public storage: StorageProvider) { }

  editProfile(): void {
    console.log('Editar perfil');
    this.navCtrl.push("EditProfilePage");
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
}
