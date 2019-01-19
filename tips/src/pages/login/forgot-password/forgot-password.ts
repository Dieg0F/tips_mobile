import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';
import { Alert } from '../../../util/alert/alert';
import { Loading } from '../../../util/loading/loading';
import { Regex } from '../../../util/regex/regex';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  private regex: Regex;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public loading: Loading,
    public toast: Toast,
    public alert: Alert) { }

  resetPassword(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Resetando a sua senha...');
      this.authProvider.resetPassword(form)
        .then(() => {
          this.loading.hideLoading();
          this.alert.simpleAlert('Senha resetada!', 'Em alguns instantes você receberá um e-mail com o link para alteração de sua senha.');
        }).catch(() => {
          this.loading.hideLoading();
          this.alert.simpleAlert('Opps!', 'Houve um erro ao resetar a senha!');
        });
    }
  }

  validateAccount(form: NgForm): Boolean {
    this.regex = new Regex
    if (!form.value.email) {
      this.toast.showToast('Insira um e-mail!')
      return false
    }
    if (!this.regex.verifyEmail(form.value.email)) {
      this.toast.showToast('E-mail não é valido!')
      return false
    }
    return true
  }
}
