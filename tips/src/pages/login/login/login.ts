import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthProvider } from '../../../providers/auth/auth';
import { Loading } from '../../../util/loading/loading';
import { Alert } from '../../../util/alert/alert';
import { Toast } from '../../../util/toast/toast';
import { Regex } from '../../../util/regex/regex';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Profile } from '../../../model/profile/profile';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
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

  ionViewWillLeave() {
    this.events.unsubscribe('login');
  }

  login(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Entrando em sua conta...')
        .then(async () => {
          this.afAuth.login(form)
            .then(async (result) => {
              this.successLogin(result);
            })
            .catch((error) => {
              console.log('Erro ao fazer login: ', error);
              this.errorLogin();
            });
        })
    }
  }

  private successLogin(result: any) {
    this.events.subscribe('login', (profile: Profile) => {
      if (profile == undefined) {
        this.errorLogin();
      }
      else {
        this.goToProfilePage();
      }
      this.events.unsubscribe('login');
    });
    this.appConfigProvider.appLogin(result.user.uid);
  }

  private goToProfilePage(showToast: boolean = true) {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    if (showToast) {
      this.toast.showToast('Bem vindo!')
    }
  }

  private errorLogin() {
    this.loading.hideLoading();
    this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login!')
  }

  validateAccount(form: NgForm): Boolean {
    this.regex = new Regex
    if (!form.value.email || !form.value.password) {
      this.toast.showToast('Insira um e-mail e sua senha!')
      return false
    }
    if (!this.regex.verifyEmail(form.value.email)) {
      this.toast.showToast('E-mail não é valido!')
      return false
    }
    if (!this.regex.verifyPassword(form.value.password)) {
      this.toast.showToast('Senha deve conter no minimo 6 caracteres!')
      return false
    }
    return true
  }

  newAccount() {
    this.navCtrl.push("NewAccountPage");
  }

  forgotPassword() {
    this.navCtrl.push("ForgotPasswordPage");
  }

  restartAccount() {
    this.profileProvider.reactiveAccount(AppConfig.USER_PROFILE)
      .then(() => {
        this.toast.showToast("Sua conta foi ativada novamente!")
          .then(() => {
            this.goToProfilePage(false);
          })
      })
      .catch(() => {
        this.errorLogin();
      })
  }
}
