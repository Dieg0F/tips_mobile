import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profile } from '../../../model/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: 'page-profile-details',
  templateUrl: 'profile-details.html',
})
export class ProfileDetailsPage {

  public profile: Profile;
  private starsRateHelper: StarRateHelper;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.starsRateHelper = new StarRateHelper();
    this.getProfile();
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getProfile();
  }

  /**
   * @description recover profile received as params.
   */
  public getProfile() {
    this.profile = this.navParams.get('profile');
  }

  /**
   * @description Build user avatar image.
   */
  public setAvatarImage() {
    let profilePhoto = '';
    if (this.profile.profilePhotoUrl) {
      profilePhoto = this.profile.profilePhotoUrl;
    } else {
      profilePhoto = '../../../assets/imgs/149071.png';
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
    value = value - this.profile.avaliationsCount;
    return this.starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    value = value - this.profile.avaliationsCount;
    return this.starsRateHelper.starsRateColor(value);
  }

  /**
   * @description redirect user to send a professional avaliations page.
   */
  public rating() {
    this.navCtrl.push('UserAvaliationsPage', { ownerAvaliationsUid: this.profile.uid, asVisitor: true });
  }

  /**
   * @description redirect user to send a service solicitaion for this user.
   */
  public makeService() {
    this.navCtrl.push('SendSolicitationPage', { profileToSolicitation: this.profile });
  }

  /**
   * @description redirect user to profile contact page.
   */
  public contact() {
    this.navCtrl.push('ContactPage', { userProfile: this.profile });
  }
}
