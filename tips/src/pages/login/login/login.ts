import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthProvider } from '../../../providers/auth/auth';


@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AuthProvider
    ) {}

  login(form: NgForm): void {
    console.log(form.value.email, form.value.password)
    this.afAuth.login(form);
    //this.navCtrl.setRoot("ProfilePage");
    //this.navCtrl.goToRoot;
  }

  newAccount() {
    this.navCtrl.push("NewAccountPage");
  }

  forgotPassword() {
    this.navCtrl.push("ForgotPasswordPage");
  }
}
