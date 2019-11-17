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
  public isVisitor: boolean;
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
    this.isVisitor = this.navParams.get('isVisitor');
    this.getProfile();
  }

  /**
   * @description recover profile received as params.
   */
  public getProfile() {
    this.profile = this.navParams.get('profile');
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    return this.starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    return this.starsRateHelper.starsRateColor(value);
  }

  /**
   * @description redirect user to send a professional avaliations page.
   */
  public rating() {
    this.navCtrl.push('UserAvaliationsPage', { ownerAvaliationsUid: this.profile, asVisitor: true });
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

  /**
   * @description Open Profile Photo Modal, for edit and better image view.
   */
  public viewProfileImage() {
    this.navCtrl.push('ImageOptionsPage', { 'isVisitor': true, 'profile': this.profile });
  }
}
