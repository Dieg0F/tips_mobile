import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Alert } from './../../../util/alert/alert';
import { Toast } from './../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public profile = { ...AppConfig.USER_PROFILE };
  public greetingMesage = '';

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public alert: Alert,
    public toast: Toast,
    public events: Events,
    public navParams: NavParams) { }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.profile = { ...AppConfig.USER_PROFILE };
    this.greetingMessageBuilder();
    this.events.unsubscribe('CHANGE_PROFILE_RATING');
    this.events.subscribe('CHANGE_PROFILE_RATING', () => {
      this.profileProvider.getProfile(this.profile.uid)
        .then((res) => {
          return this.profileProvider.saveProfileOnStorage(res.data())
            .then(() => {
              this.profile = { ...AppConfig.USER_PROFILE };
            });
        });
    });
  }
  /**
   * @description Build user avatar image.
   */
  public setAvatarImage() {
    let profilePhoto = '';
    if (this.profile.profilePhotoUrl) {
      profilePhoto = this.profile.profilePhotoUrl;
    } else {
      profilePhoto = '../../../assets/imgs/user_default_image.png';
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    const starsRateHelper = new StarRateHelper();
    return starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    const starsRateHelper = new StarRateHelper();
    return starsRateHelper.starsRateColor(value);
  }

  /**
   * @description redirect user to profile contact page.
   */
  public contact() {
    this.navCtrl.push('ContactPage', { userProfile: this.profile });
  }

  /**
   * @description redirect user to search professional page.
   */
  public search() {
    this.navCtrl.push('SearchPage');
  }

  /**
   * @description redirect user to send a professional avaliations page.
   */
  public rating() {
    this.navCtrl.push('UserAvaliationsPage');
  }

  /**
   * @description redirect user to send a professional avaliations page.
   */
  public goToMyAccount() {
    this.navCtrl.push('MyAccountPage');
  }

  /**
   * @description build user greeting message.
   */
  public greetingMessageBuilder() {
    const date = new Date();
    const hours = date.getHours();

    if (hours >= 0 && hours < 5) {
      this.greetingMesage = 'Boa madrugada, ';
    } else if (hours >= 5 && hours <= 12) {
      this.greetingMesage = 'Bom dia, ';
    } else if (hours >= 13 && hours <= 18) {
      this.greetingMesage = 'Boa tarde, ';
    } else if (hours > 18 && hours < 24) {
      this.greetingMesage = 'Boa noite, ';
    }
  }

  /**
   * @description Open Profile Photo Modal, for edit and better image view.
   */
  public viewProfileImage() {
    this.navCtrl.push('ImageOptionsPage', { 'isVisitor': false, 'profile': this.profile });
  }
}
