import { ContractProvider } from './../../../providers/contract/contract';
import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { Contract } from '../../../model/contract/contract';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-new-contract',
  templateUrl: 'new-contract.html',
})
export class NewContractPage {

  public contractorProfile: Profile
  public hiredProfile: Profile
  public contractConfirmed: boolean = false
  public contract: Contract

  public contractName = "";
  public contractDesctiption = "";

  public describeContract: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public contractProvider: ContractProvider) { }

  ionViewWillEnter() {
    this.getProfileToContract()
  }

  getProfileToContract() {
    this.contractorProfile = { ...AppConfig.USER_PROFILE }
    this.hiredProfile = this.navParams.get(Constants.CONTRACT_PROFILE)
  }

  makeContract() {
    setTimeout(() => {
      this.contractConfirmed = true;
      this.describeContract = false;
      this.contractUser()
    }, 2000)
  }

  contractUser() {
    var date: Date = new Date()
    let contract: Contract = {
      uId: UUID.UUID(),
      contractId: UUID.UUID(),
      ownerUid: this.contractorProfile.uid,
      contractorUid: this.contractorProfile.uid,
      hiredUid: this.hiredProfile.uid,
      lastActionByUserUid: this.contractorProfile.uid,
      name: this.contractName,
      description: this.contractDesctiption,
      date: date.toLocaleDateString(),
      status: Constants.CONTRACT_IS_OPEN,
      isRemoved: false
    }

    this.saveDoubleContract(contract);
  }

  private saveDoubleContract(contract: Contract) {
    this.contractProvider.createContract(contract)
      .then(() => {
        contract.uId = UUID.UUID();
        contract.ownerUid = this.hiredProfile.uid;
        contract.status = Constants.CONTRACT_IS_OPEN;
        return this.contractProvider.createContract(contract)
          .then(() => {
            this.contractConfirmed = true;
          });
      })
      .catch((err) => {
        console.log(err);
        this.contractConfirmed = false;
      });
  }

  setContractDescription() {
    this.describeContract = true;
  }

  backToMyProfile() {
    this.navCtrl.setRoot("ProfilePage");
  }
}
