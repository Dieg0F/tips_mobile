import { Profile } from './../../../model/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Alert } from './../../../util/alert/alert';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { AuthProvider } from '../../../providers/auth/auth';
import { StorageProvider } from '../../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-app-config',
  templateUrl: 'app-config.html',
})
export class AppConfigPage {

  public profile: Profile = { ...AppConfig.USER_PROFILE };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public authProvider: AuthProvider,
    public storage: StorageProvider,
    public alert: Alert,
    public toast: Toast,
    public loading: Loading) {
  }

  updateProfileExbition() {
    this.profile.hideMyProfile = !this.profile.hideMyProfile;
    this.updateProfile()
  }

  updateAccountType() {
    //Account Condition, based on account Type
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    var message = ""
    if (message) {
      message = "Deseja alterar o tipo de sua conta para profissional?"
    } else {
      message = "Deseja alterar o tipo de sua conta para usuário simples?"
    }

    this.alert.confirmAlert('Alterar tipo de conta',
      message,
      () => {
        this.confirmAccountType()
      }, null)
  }

  confirmAccountType() {
    this.profile.isAPro = !this.profile.isAPro;
    this.updateProfile()
  }

  updatePassword() {
    this.alert.confirmAlert('Alteração senha',
      'Deseja alterar a sua senha de acesso?',
      () => {
        this.confirmUpdatePassoword()
      }, null)
  }

  confirmUpdatePassoword() {
    this.authProvider.resetPassword(this.profile.email)
      .then(() => {
        this.alert.simpleAlert(
          "Nova senha",
          "Pedido de alteração de senha com sucesso! Verifique o seu e-mail."
        )
      })
      .catch(() => {
        this.toast.showToast("Erro ao pedir alteração de senha!");
      })
  }

  disableAccount() {
    this.alert.confirmAlert('Excluir conta',
      'Deseja excluir a sua conta? Não será possivel recuperar a conta novamente.',
      () => {
        this.confirmDisableAccount()
      }, null)
  }

  confirmDisableAccount() {
    this.profile.isActive = false;
    this.updateProfile();
  }

  async updateProfile() {
    this.loading.showLoading("Atualizando perfil...")
      .then(async () => {
        this.profileProvider.saveProfile(this.profile)
          .then(async () => {
            if (this.profile.isActive == false) {
              this.logout();
            } else {
              return this.loading.hideLoadingPromise()
                .then(() => {
                  this.toast.showToast("Perfil atualizado!");
                })
            }
          })
          .catch((err) => {
            this.loading.hideLoading();
            this.toast.showToast("Erro ao atualizar perfil!");
            console.log(err)
          })
      })
  }

  logout() {
    this.authProvider.logout()
      .then(async () => {
        return this.storage.clearAll()
          .then(() => {
            this.goToLoginPage()
          })
      })
      .catch((error) => {
        console.log('Error: ', error);
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao remover a sua conta!')
      })
  }

  private goToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    this.toast.showToast('Conta removida com sucesso!');
  }
}
