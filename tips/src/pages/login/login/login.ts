import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthProvider } from '../../../providers/auth/auth';
import { Loading } from '../../../util/loading/loading';
import { Alert } from '../../../util/alert/alert';
import { Toast } from '../../../util/toast/toast';
import { Regex } from '../../../util/regex/regex';
import { AppConfigProvider } from '../../../providers/app-config/app-config';
import { AppConfig } from '../../../model/static/static';

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
    public appConfigProvider: AppConfigProvider,
    public alert: Alert,
    public toast: Toast) { }

  login(form: NgForm): void {
    let awatiForLoginInterval: any
    if (this.validateAccount(form)) {
      this.loading.showLoading('Entrando em sua conta...');
      this.afAuth.login(form)
        .then(async (result) => {
          let userAuth = {
            uid: result.user.uid
          }
          this.appConfigProvider.appLogin(userAuth)
          let awaitForLogin = 0
          awatiForLoginInterval = setInterval(() => {
            if (AppConfig.HAS_USER) {
              this.goToProfilePage();
              clearInterval(awatiForLoginInterval)
              awatiForLoginInterval = undefined
            } else {
              awaitForLogin++
              if (awaitForLogin >= 30) {
                this.errorLogin();
                clearInterval(awatiForLoginInterval)
                awatiForLoginInterval = undefined
              }
            }
          }, 1000)
        })
        .catch((error) => {
          console.log('Erro ao fazer login: ', error);
          clearInterval(awatiForLoginInterval)
          awatiForLoginInterval = undefined
          this.errorLogin();
        });
    }
  }

  private goToProfilePage() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    this.toast.showToast('Bem vindo!');
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
}
