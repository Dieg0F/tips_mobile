import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
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

  public contract: Contract;
  public contractStatus: string = ""
  public userProfile = { ...AppConfig.USER_PROFILE };
  public hiredProfile: Profile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public popover: Popover,
    public alert: Alert,
    public profileProvider: ProfileProvider) {
    this.getContract();
  }

  ionViewWillEnter() {
    this.getContract();
  }

  async getContract() {
    this.contract = this.navParams.get(Constants.CONTRACT_DETAILS);
    this.hiredProfile = this.navParams.get(Constants.CONTRACT_DETAILS_HIRED);

    switch (this.contract.status) {
      case Constants.CONTRACT_IS_OPEN:
        if (this.contract.hiredUid = this.userProfile.uid) {
          this.contractStatus = "Você ainda não aprovou este contrato!";
        } else {
          this.contractStatus = "Aguardando aprovação do contratado!";
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_CANCEL:
        if (this.contract.hiredUid = this.userProfile.uid) {
          this.contractStatus = "O contratado cancelou este contrato!";
        } else {
          this.contractStatus = "Você cancelou este contrato!";
        }
        break;
      case Constants.CONTRACT_IS_AWAIT_TO_FINISH:
        if (this.contract.hiredUid = this.userProfile.uid) {
          this.contractStatus = "O contratado finalizou este contrato!";
        } else {
          this.contractStatus = "Você finalizou este contrato!";
        }
        break;
    }
  }

  openOptions(event) {
    this.popover.showPopover("ContractOptionsPage", { 'contract': this.contract }, event)
  }

  responseContract() {

  }
}
