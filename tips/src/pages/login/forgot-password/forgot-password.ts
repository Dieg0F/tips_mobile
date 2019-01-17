import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  resetPassword(form: NgForm): void {
    this.authProvider.updateAccount(form)
    .then(() => {
      console.log("Success")  
      this.successAlert()    
    }).catch(() => {
      console.log("Error")
      this.errorAlert()
    });
  }

  // Methodos dos alerts!!
  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Opps!',
      subTitle: 'Houve um erro ao resetar a senha',
      buttons: ['Ok']
    });
    alert.present();
  }

  successAlert() {
    let alert = this.alertCtrl.create({
      title: 'Senha resetada!',
      subTitle: 'Em alguns instantes você receberá um e-mail com o link para alteração de sua senha.',
      buttons: ['Ok']
    });
    alert.present();
  }

}
