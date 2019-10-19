import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { AuthProvider } from '../../../providers/auth/auth';
import { StorageProvider } from '../../../providers/storage/storage';
import { Profile } from './../../../model/profile/profile';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';

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

  /**
   * @description change profile exibition on searchs.
   */
  public updateProfileExbition() {
    this.profile.hideMyProfile = !this.profile.hideMyProfile;
    this.updateProfile();
  }

  /**
   * @description change user account type alert information.
   */
  public updateAccountType() {
    let message = '';
    if (message) {
      message = 'Deseja alterar o tipo de sua conta para profissional?';
    } else {
      message = 'Deseja alterar o tipo de sua conta para usuário simples?';
    }

    this.alert.confirmAlert('Alterar tipo de conta',
      message,
      () => {
        this.confirmAccountType();
      }, null);
  }

  /**
   * @description change user account type.
   */
  public confirmAccountType() {
    this.profile.isAPro = !this.profile.isAPro;
    this.updateProfile();
  }

  /**
   * @description change user password alert information.
   */
  public updatePassword() {
    this.alert.confirmAlert('Alteração senha',
      'Deseja alterar a sua senha de acesso?',
      () => {
        this.confirmUpdatePassoword();
      }, null);
  }

  /**
   * @description confirm user change password alert information.
   */
  public confirmUpdatePassoword() {
    this.authProvider.resetPassword(this.profile.email)
      .then(() => {
        this.alert.simpleAlert(
          'Nova senha',
          'Pedido de alteração de senha com sucesso! Verifique o seu e-mail.',
        );
      })
      .catch(() => {
        this.toast.showToast('Erro ao pedir alteração de senha!');
      });
  }

  /**
   * @description disable user account alert information.
   */
  public disableAccount() {
    this.alert.confirmAlert('Excluir conta',
      'Deseja excluir a sua conta? Não será possivel recuperar a conta novamente.',
      () => {
        this.confirmDisableAccount();
      }, null);
  }

  /**
   * @description disable user account.
   */
  public confirmDisableAccount() {
    this.profile.isActive = false;
    this.updateProfile();
  }

  /**
   * @description update user profile.
   */
  public async updateProfile() {
    this.loading.showLoading('Atualizando perfil...')
      .then(async () => {
        this.profileProvider.saveProfile(this.profile)
          .then(async () => {
            if (this.profile.isActive === false) {
              this.logout();
            } else {
              return this.loading.hideLoadingPromise()
                .then(() => {
                  this.toast.showToast('Perfil atualizado!');
                });
            }
          })
          .catch((err) => {
            this.loading.hideLoading();
            this.toast.showToast('Erro ao atualizar perfil!');
          });
      });
  }

  /**
   * @description logout user and clear all data.
   */
  public logout() {
    this.authProvider.logout()
      .then(async () => {
        return this.storage.clearAll()
          .then(() => {
            this.goToLoginPage();
          });
      })
      .catch((error) => {
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao remover a sua conta!');
      });
  }

  /**
   * @description redirect user to login page.
   */
  private goToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
    this.loading.hideLoading();
    this.toast.showToast('Conta removida com sucesso!');
  }
}
