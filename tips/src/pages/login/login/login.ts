import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';

import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AuthProvider } from '../../../providers/auth/auth';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Alert } from '../../../util/alert/alert';
import { Loading } from '../../../util/loading/loading';
import { Regex } from '../../../util/regex/regex';
import { Toast } from '../../../util/toast/toast';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private regex: Regex;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AuthProvider,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public appConfigProvider: AppConfigProvider,
    public events: Events,
    public alert: Alert,
    public toast: Toast) { }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('login');
  }

  /**
   * @description start user autentication on application.
   * @param form view form with all user data values.
   */
  public login(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Entrando em sua conta...')
        .then(async () => {
          this.afAuth.login(form)
            .then(async (result) => {
              this.successLogin(result);
            })
            .catch((error) => {
              console.log('Error: ', error);
              this.errorLogin();
            });
        });
    }
  }

  /**
   * @description validate if user account is valid.
   * @param form view form with all user data values.
   */
  public validateAccount(form: NgForm): boolean {
    this.regex = new Regex();
    if (!form.value.email || !form.value.password) {
      this.toast.showToast('Insira um e-mail e sua senha!');
      return false;
    }
    if (!this.regex.verifyEmail(form.value.email)) {
      this.toast.showToast('E-mail não é valido!');
      return false;
    }
    if (!this.regex.verifyPassword(form.value.password)) {
      this.toast.showToast('Senha deve conter no minimo 6 caracteres!');
      return false;
    }
    return true;
  }

  /**
   * @description redirect user to new account page.
   */
  public newAccount() {
    this.navCtrl.push('NewAccountPage');
  }

  /**
   * @description redirect user to forgot password page.
   */
  public forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

  /**
   * @description if user that has a disabled account login, this method will receive it again.
   */
  public restartAccount() {
    this.profileProvider.reactiveAccount(AppConfig.USER_PROFILE)
      .then(() => {
        this.toast.showToast('Sua conta foi ativada novamente!')
          .then(() => {
            this.goToProfilePage(false);
          });
      })
      .catch(() => {
        this.errorLogin();
      });
  }

  /**
   * @description do a success login flow.
   * @param result user authenticate success response.
   */
  private successLogin(result: any) {
    this.events.subscribe('login', (profile: Profile) => {
      if (profile === undefined) {
        this.errorLogin();
      } else {
        this.goToProfilePage();
      }
      this.events.unsubscribe('login');
    });
    this.appConfigProvider.appLogin(result.user.uid);
  }

  /**
   * @description redirect user to profile page.
   */
  private goToProfilePage(showToast: boolean = true) {
    this.navCtrl.setRoot('ProfilePage');
    this.loading.hideLoading();
    if (showToast) {
      this.toast.showToast('Bem vindo!');
    }
  }

  /**
   * @description do a error login flow.
   * @param result user authenticate success response.
   */
  private errorLogin(error?: any) {
    this.loading.hideLoading();
    if (error) {
      switch (error.code) {
        case Constants.USER_NOT_FOUND:
          this.toast.showToast('E-mail de usuário não encontrado.');
          break;
        case Constants.USER_WRONG_PASS:
          this.toast.showToast('E-mail ou senha incorretos.');
          break;
        case Constants.LOGIN_NETWORK_FAIL:
          this.toast.showToast('Erro ao realizar login, verifique sua conexão com a internet.');
          break;
        default:
          this.toast.showToast('Erro ao realizar login.');
          break;
      }
    } else {
      this.toast.showToast('Erro ao realizar login.');
    }
  }
}
