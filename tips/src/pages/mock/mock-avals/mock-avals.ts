import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-mock-avals',
  templateUrl: 'mock-avals.html',
})
export class MockAvalsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public toUsers() {
    this.navCtrl.push('MockUsersPage');
  }

  public toSolicitations() {
    this.navCtrl.push('MockSolsPage');
  }

}
