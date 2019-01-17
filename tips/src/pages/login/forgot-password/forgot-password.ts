import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';
import { Alert } from '../../../util/alert/alert';
import { Loading } from '../../../util/loading/loading';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public loading: Loading,
    public alert: Alert) {}

  resetPassword(form: NgForm): void {
    this.loading.showLoading('Resetando a sua senha...');
    this.authProvider.updateAccount(form)
      .then(() => {
        this.loading.hideLoading();
        this.alert.simpleAlert('Senha resetada!', 'Em alguns instantes você receberá um e-mail com o link para alteração de sua senha.');
      }).catch(() => {
        this.loading.hideLoading();
        this.alert.simpleAlert('Opps!', 'Houve um erro ao resetar a senha');
      });
  }
}
