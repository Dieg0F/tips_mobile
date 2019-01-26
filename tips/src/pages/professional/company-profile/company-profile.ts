import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { ProfileProvider } from '../../../providers/profile/profile';
import { UserProvider } from '../../../providers/user/user';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-company-profile',
  templateUrl: 'company-profile.html',
})
export class CompanyProfilePage {

  @ViewChild(Slides) slides: Slides;

  public profile = AppConfig.USER_PROFILE

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public profileProvider: ProfileProvider) { }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
  }

  save() {
    console.log("Slide Finished");
    this.profileProvider.saveProfile({ ...this.profile })
  }

  slideNext() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slidePrev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }  
}

