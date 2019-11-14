import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  public tab1: any;
  public tab2: any;
  public tab3: any;
  public tab4: any;
  public tab5: any;

  constructor() {
    this.tab1 = 'ProfilePage';
    this.tab2 = 'UserSolicitationsPage';
    this.tab3 = 'SearchPage';
    this.tab4 = 'UserAvaliationsPage';
    this.tab5 = 'AppConfigPage';
  }

}
