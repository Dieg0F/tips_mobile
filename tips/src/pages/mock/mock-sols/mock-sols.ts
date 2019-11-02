import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-mock-sols',
  templateUrl: 'mock-sols.html',
})
export class MockSolsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public toUsers() {
    this.navCtrl.push('MockUsersPage');
  }

  public toAvaliations() {
    this.navCtrl.push('MockAvalsPage');
  }

}
