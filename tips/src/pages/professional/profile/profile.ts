import { Alert } from './../../../util/alert/alert';
import { Constants } from './../../../util/constants/constants';
import { ContractProvider } from './../../../providers/contract/contract';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {

  public profile = { ...AppConfig.USER_PROFILE }

  public greetingMesage = "";

  constructor(
    public navCtrl: NavController,
    public profileProvider: ProfileProvider,
    public contractProvider: ContractProvider,
    public alert: Alert,
    public navParams: NavParams) {
  }

  ionViewWillEnter() {
    var elm = document.getElementById('img_profile');
    elm.style.backgroundImage = "url('" + AppConfig.USER_PROFILE.profilePhotoUrl + "')";
    this.greetingMessageBuilder();
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

  contact() {
    this.navCtrl.push("ContactPage", { 'userProfile': this.profile });
  }

  search() {
    this.navCtrl.push("SearchPage");
  }

  rating() {
    this.navCtrl.push("UserAvaliationsPage");
  }

  contractManager() {
    this.contractProvider.getContracts(this.profile.uid)
      .then((res) => {
        res.subscribe((values) => {
          var hasContractPending = false

          values.forEach(element => {
            if ((element.status == Constants.CONTRACT_IS_OPEN ||
              element.status == Constants.CONTRACT_IS_AWAIT_TO_CANCEL ||
              element.status == Constants.CONTRACT_IS_AWAIT_TO_FINISH) &&
              (element.lastActionByUserUid != this.profile.uid) &&
              (element.ownerUid == this.profile.uid)) {
              hasContractPending = true
            }
          });

          if (hasContractPending) {
            this.alert.confirmAlert(
              "Contratos pendentes!",
              "Você possui contratos aguardando sua ação!",
              () => { this.navCtrl.push("UserContractsPage"); },
              () => { }, "Depois", "Ver Contratos")
          }
        })
      })
  }

  greetingMessageBuilder() {
    var date = new Date()
    var hours = date.getHours();

    if (hours >= 0 && hours < 5) {
      this.greetingMesage = "Boa madrugada, ";
    } else if (hours >= 5 && hours <= 12) {
      this.greetingMesage = "Bom dia, ";
    } else if (hours > 13 && hours <= 18) {
      this.greetingMesage = "Boa tarde, ";
    } else if (hours > 18 && hours < 24) {
      this.greetingMesage = "Boa noite, ";
    }
  }
}
