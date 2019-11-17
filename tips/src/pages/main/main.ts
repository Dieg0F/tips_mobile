import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

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
