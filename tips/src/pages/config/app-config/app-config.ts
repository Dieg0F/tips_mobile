import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
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
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public authProvider: AuthProvider,
    public storage: StorageProvider,
    public alert: Alert,
    public toast: Toast,
    public loading: Loading) {
  }

  public updateProfileExibition() {
    let message = '';
    if (!this.profile.hideMyProfile) {
      message = 'Deseja ocultar seu perfil nas buscas? Alerando esta opção os usuários do aplicativo não te encontrarão nas buscas.';
    } else {
      message = 'Deseja exibir seu perfil nas buscas? Alerando esta opção, seu perfil será encontrado nas buscas por outros usuários.';
    }

    this.alert.confirmAlert('Exibição do meu perfil.',
      message,
      () => {
        this.updateProfileView();
      }, () => { });
  }

  /**
   * @description change profile exibition on searchs.
   */
  public updateProfileView() {
    this.profile.hideMyProfile = !this.profile.hideMyProfile;
    this.updateProfile();
  }

  /**
   * @description change user account type alert information.
   */
  public updateAccountType() {
    let message = '';
    if (!this.profile.isAPro) {
      message = 'Deseja alterar a sua conta para o tipo profissional?';
    } else {
      message = 'Deseja alterar a sua conta para o tipo cliente?';
    }

    this.alert.confirmAlert('Alterar tipo de conta.',
      message,
      () => {
        this.confirmAccountType();
      }, () => { });
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
    this.alert.confirmAlert('Alterar senha de acesso.',
      'Deseja alterar a senha de sua conta?',
      () => {
        this.confirmUpdatePassoword();
      }, () => { });
  }

  /**
   * @description confirm user change password alert information.
   */
  public confirmUpdatePassoword() {
    this.authProvider.resetPassword(this.profile.email)
      .then(() => {
        this.alert.simpleAlert(
          'Verifique seu e-mail!',
          'Pedido de alteração de senha com sucesso! Você receberá em instantes um e-mail para alteração de senha.',
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
    this.alert.confirmAlert('Desativar conta.',
      'Deseja desativar a sua conta? Sua conta será desativada e você não receberá mais contatos.',
      () => {
        this.confirmDisableAccount();
      }, () => { });
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
        this.toast.showToast('Houve um erro ao sair de sua conta!');
      });
  }

  /**
   * @description redirect user to login page.
   */
  public goToAboutApp() {
    this.navCtrl.push('AboutPage');
  }

  /**
   * @description show a alert information for accoutn logout.
   */
  public logoutApp() {
    this.alert.confirmAlert(
      'Sair da sua conta.',
      'Deseja sair de sua conta?',
      () => { this.goToLoginPage(); },
      () => { }
    );
  }

  /**
   * @description redirect user to login page.
   */
  private goToLoginPage() {
    this.app.getRootNav().setRoot('LoginPage');
    this.loading.hideLoading();
  }
}
