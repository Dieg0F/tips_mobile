import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthProvider } from '../../../providers/auth/auth';
import { Loading } from '../../../util/loading/loading';
import { Alert } from '../../../util/alert/alert';
import { Toast } from '../../../util/toast/toast';
import { Regex } from '../../../util/regex/regex';
import { UserProvider } from '../../../providers/user/user';
import { StorageProvider } from '../../../providers/storage/storage';

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
    public userProvider: UserProvider,
    public storage: StorageProvider,
    public alert: Alert,
    public toast: Toast) { }

  login(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Entrando em sua conta...');
      this.afAuth.login(form)
        .then(async (result) => {
          console.log(result)
          return this.userProvider.saveUserAuth(result.user.uid)
            .then(() => {
              this.goToProfilePage();
            });
        })
        .catch((error) => {
          console.log('Erro ao fazer login: ', error)
          this.loading.hideLoading();
          this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login!')
        });
    }
  }

  private goToProfilePage() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    this.toast.showToast('Bem vindo!');
  }

  googleLogin() {
    this.loading.showLoading('Entrando em com sua conta...');
    this.afAuth.googleLogin()
      .then(async (result) => {
        console.log(result)
        let newUser = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          confimPass: "",
          accountType: 'GOOGLE'
        }
        return this.userProvider.saveNewUser(newUser)
          .then(async () => {
            return this.userProvider.saveUserAuth(result.user.uid)
              .then(() => {
                this.goToProfilePage();
              });
          })
      })
      .catch((error) => {
        console.log('Erro ao fazer login: ', error)
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login com sua conta Google!')
      })
  }

  facebookLogin() {
    this.loading.showLoading('Entrando em com sua conta...');
    this.afAuth.facebookLogin()
      .then(async (result) => {
        console.log(result)
        let newUser = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          confimPass: "",
          accountType: 'FACEBOOK'
        }
        return this.userProvider.saveNewUser(newUser)
          .then(async () => {
            return this.userProvider.saveUserAuth(result.user.uid)
              .then(() => {
                this.goToProfilePage();
              });
          })
      })
      .catch((error) => {
        console.log('Erro ao fazer login: ', error)
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login com sua conta do Facebook!')
      })
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
