import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contract } from '../../../model/contract/contract';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-contract-details',
  templateUrl: 'contract-details.html',
})
export class ContractDetailsPage {

  public contract: Contract
  public userProfile = { ...AppConfig.USER_PROFILE }
  public hiredProfile: Profile

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public profileProvider: ProfileProvider) {
    this.getAvaliation();
  }

  ionViewWillEnter() {
    this.getAvaliation();
  }

  async getAvaliation() {
    this.contract = this.navParams.get(Constants.CONTRACT_DETAILS);
    this.hiredProfile = this.navParams.get(Constants.CONTRACT_DETAILS_HIRED);
  }

}
