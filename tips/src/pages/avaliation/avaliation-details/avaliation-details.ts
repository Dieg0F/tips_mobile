import { Component } from '@angular/core';
import { Events, IonicPage, NavParams } from 'ionic-angular';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { Profile } from '../../../model/profile/profile';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Toast } from './../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-avaliation-details',
  templateUrl: 'avaliation-details.html',
})
export class AvaliationDetailsPage {

  public avaliation: Avaliation;
  public avaliationOwner: Profile;
  public avaliationDate: string = '';

  constructor(
    public navParams: NavParams,
    public loading: Loading,
    public events: Events,
    public toast: Toast,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) {
    this.getAvaliation();
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getAvaliation();
    this.events.subscribe('CHANGE_AVALIATION', (data: any) => {
      this.avaliationProvider.getAvaliationById(data)
        .then((res) => {
          this.avaliation = res.data();
          this.toast.showToast('Avaliação atualizada por ' + this.avaliationOwner.name.firstName + '!');
        });
    });
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('CHANGE_AVALIATION');
  }

  /**
   * @description Build user avatar image.
   */
  public setAvatarImage() {
    let profilePhoto = '';
    if (this.avaliationOwner.profilePhotoUrl) {
      profilePhoto = this.avaliationOwner.profilePhotoUrl;
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
   * @description get the avaliation received by params.
   */
  public async getAvaliation() {
    this.avaliation = this.navParams.get(Constants.AVALIATION_DETAILS);
    this.avaliationOwner = this.navParams.get(Constants.AVALIATION_DETAILS_OWNER);

    this.avaliationDate = new Date(this.avaliation.date).toLocaleDateString();
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

}
