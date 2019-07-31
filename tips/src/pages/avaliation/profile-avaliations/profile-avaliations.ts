import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { AppConfig } from '../../../model/static/static';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';

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
    public avaliationsProvider: AvaliationProvider) {
    this.getAvaliations()
  }

  getAvaliations() {
    console.log(AppConfig.USER_PROFILE.uid)
    this.loading.showLoading("Buscando Avaliações...")
    this.avaliationsProvider.getAvaliationByUser(AppConfig.USER_PROFILE.uid)
      .then((res) => {
        console.log(res)
        this.avaliations = res;
        this.loading.hideLoading();
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
}
