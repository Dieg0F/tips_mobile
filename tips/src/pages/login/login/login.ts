import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
    ) {}

  login() {
    this.navCtrl.setRoot("ProfilePage");
    this.navCtrl.goToRoot;
  }

  newAccount() {
    this.navCtrl.push("NewAccountPage");
  }

  forgotPassword() {
    this.navCtrl.push("ForgotPasswordPage");
  }
}
