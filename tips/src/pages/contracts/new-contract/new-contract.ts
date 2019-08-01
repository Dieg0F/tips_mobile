import { ContractProvider } from './../../../providers/contract/contract';
import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { Contract } from '../../../model/contract/contract';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-new-contract',
  templateUrl: 'new-contract.html',
})
export class NewContractPage {

  public userProfile: Profile
  public profileToContract: Profile
  public contractConfirmed: boolean = false
  public contract: Contract

  public contractName = "";
  public contractDesctiption = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contractProvider: ContractProvider) {
    this.getProfileToContract()
  }

  ionViewWillEnter() {
    this.getProfileToContract()
  }

  getProfileToContract() {
    this.userProfile = { ...AppConfig.USER_PROFILE }
    this.profileToContract = this.navParams.get('profileToContract')
  }

  makeContract() {
    setTimeout(() => {
      this.contractConfirmed = true;
      this.contractUser()
    }, 2000)
  }

  contractUser() {
    var date: Date = new Date()

    let contract: Contract = {
      uId: UUID.UUID(),
      name: this.contractName,
      description: this.contractDesctiption,
      date: date.getUTCDate().toString(),
      userUid: this.userProfile.uid,
      hiredUid: this.profileToContract.uid
    }

    this.contractProvider.createContract(contract)
      .then((res) => {
        console.log(res)
        this.contractConfirmed = true
      })
      .catch((err) => {
        console.log(err)
        this.contractConfirmed = false
      })
  }
}
