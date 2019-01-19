import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthProvider } from '../../../providers/auth/auth';
import { Loading } from '../../../util/loading/loading';
import { Alert } from '../../../util/alert/alert';
import { Toast } from '../../../util/toast/toast';
import { Regex } from '../../../util/regex/regex';
import { UserProvider } from '../../../providers/user/user';


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
    public alert: Alert,
    public toast: Toast) { }

  login(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Entrando em sua conta...');
      this.afAuth.login(form)
        .then((result) => {
          console.log(result)
          console.log('Login com sucesso!')
          this.loading.hideLoading();
          this.toast.showToast('Bem vindo!')
        })
        .catch((error) => {
          console.log('Erro ao fazer login: ', error)
          this.loading.hideLoading();
          this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login!')
        });
    }
  }

  googleLogin() {    
    this.loading.showLoading('Entrando em com sua conta...');
    this.afAuth.googleLogin()
      .then((result) => {
        console.log(result)
        let newUser = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          confimPass: "",
          accountType: 'GOOGLE'
        }
        this.userProvider.saveNewUser(newUser)
          .then(() =>{
            this.loading.hideLoading();
            this.toast.showToast('Bem vindo, ' + newUser.name + '!')
          })
          .catch((error) =>{
            console.log('Erro ao fazer login: ', error)
            this.loading.hideLoading();
            this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login com sua conta Google!')
          })
      })
  }

  facebookLogin() {
    this.loading.showLoading('Entrando em com sua conta...');
    this.afAuth.facebookLogin()
      .then((result) => {
        console.log(result)
        let newUser = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          confimPass: "",
          accountType: 'FACEBOOK'
        }
        this.userProvider.saveNewUser(newUser)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast('Bem vindo, ' + newUser.name + '!')
          })
          .catch((error) => {
            console.log('Erro ao fazer login: ', error)
            this.loading.hideLoading();
            this.alert.simpleAlert('Opps!', 'Houve um erro ao fazer login com sua conta Google!')
          })
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
