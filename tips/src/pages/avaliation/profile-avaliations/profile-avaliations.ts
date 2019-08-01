import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { AppConfig } from '../../../model/static/static';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { ProfileProvider } from '../../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-profile-avaliations',
  templateUrl: 'profile-avaliations.html',
})
export class ProfileAvaliationsPage {

  private avaliations = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public avaliationsProvider: AvaliationProvider) {
    this.avaliations = new Array<Avaliation>()
    this.getAvaliations();
  }

  getAvaliations() {
    var ownerAvaliationsUid = ""
    if (!this.navParams.get('ownerAvaliationsUid')) {
      ownerAvaliationsUid = AppConfig.USER_PROFILE.uid
    } 

    this.loading.showLoading("Buscando Avaliações...")
    this.avaliationsProvider.getAvaliationByUser(ownerAvaliationsUid)
      .then((res) => {
        res.subscribe((values) => {
          this.avaliations = values;
          this.loading.hideLoading();
        })
      })
      .catch((err) => {
        console.log(err);
        this.loading.hideLoading();
        this.toast.showToast("Erro ao buscar avaliações!")
      })
  }

  starsRate(value: number): Array<String> {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    var starsRateHelper = new StarRateHelper
    return starsRateHelper.starsRateColor(value)
  }

  goToDetails(avaliation: any) {

    this.profileProvider.getProfile(avaliation.appraiserUid)
      .then((res) => {
        this.navCtrl.push('AvaliationDetailsPage', { 'avaliation': avaliation, 'avaliationOwner': res.data() })
      })
      .catch(() => {
        this.toast.showToast("Erro ao exibir detalhes da avaliação!")
      })
  }
}
