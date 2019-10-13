import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Loading } from '../../../util/loading/loading';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { Profile } from '../../../model/profile/profile';
import { Constants } from '../../../util/constants/constants';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';

@IonicPage()
@Component({
  selector: 'page-avaliation-details',
  templateUrl: 'avaliation-details.html',
})
export class AvaliationDetailsPage {

  public avaliation: Avaliation
  public avaliationOwner: Profile

  public avaliationDate: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public events: Events,
    public toast: Toast,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) {
    this.getAvaliation();
  }

  ionViewWillEnter() {
    this.getAvaliation();
    this.events.subscribe("CHANGE_AVALIATION", (data: any) => {
      this.avaliationProvider.getAvaliationById(data)
        .then((res) => {
          this.avaliation = res.data();
          this.toast.showToast("Avaliação atualizada por " + this.avaliationOwner.name.firstName + "!");
        })
    })
  }

  ionViewWillLeave() {
    this.events.unsubscribe("CHANGE_AVALIATION");
  }

  setAvatarImage() {
    var profilePhoto = "";
    if (this.avaliationOwner.profilePhotoUrl) {
      profilePhoto = this.avaliationOwner.profilePhotoUrl;
    } else {
      profilePhoto = "../../../assets/imgs/149071.png";
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-size': 'cover',
      'background-position': 'center'
    };
  }

  async getAvaliation() {
    this.avaliation = this.navParams.get(Constants.AVALIATION_DETAILS);
    this.avaliationOwner = this.navParams.get(Constants.AVALIATION_DETAILS_OWNER);

    this.avaliationDate = new Date(this.avaliation.date).toLocaleDateString();
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

}
