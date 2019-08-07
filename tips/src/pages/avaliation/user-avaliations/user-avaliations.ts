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
  selector: 'page-user-avaliations',
  templateUrl: 'user-avaliations.html',
})
export class UserAvaliationsPage {

  public avaliations: Array<Avaliation> = new Array<Avaliation>();
  public receivedAvaliations: Array<Avaliation> = new Array<Avaliation>();
  public doneAvaliations: Array<Avaliation> = new Array<Avaliation>();

  public avaliationType = "Todas as avaliações";

  public ownerAvaliationsUid = "";

  public requestingAvaliations = true;

  private subscription: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public avaliationsProvider: AvaliationProvider) {

    if (!this.navParams.get('ownerAvaliationsUid')) {
      this.ownerAvaliationsUid = AppConfig.USER_PROFILE.uid
    }

    this.onFilterChange();
  }

  getReceivedAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
    this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
      .then((res) => {
        res.subscribe((values) => {
          this.avaliations = values;
          this.onSuccess();
        })
      })
      .catch((err) => {
        console.log(err);
        this.onError()
      })
  }

  getDoneAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
    this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
      .then((res) => {
        res.subscribe((values) => {
          this.avaliations = values;
          this.onSuccess();
        })
      })
      .catch((err) => {
        console.log(err);
        this.onError();
      })
  }

  getAllAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
    this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
      .then((received) => {
        received.subscribe((receivedAvaliations) => {
          return this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
            .then((done) => {
              done.subscribe((doneAvaliations) => {
                doneAvaliations.forEach(doneAvaliation => {
                  this.avaliations.push(doneAvaliation)
                });
                receivedAvaliations.forEach(receivedAvaliation => {
                  this.avaliations.push(receivedAvaliation)
                });
                this.onSuccess();
              })
            })
        })
      })
      .catch((err) => {
        console.log(err);
        this.loading.hideLoading();
        this.toast.showToast("Erro ao buscar avaliações!")
      })
  }

  private onSuccess() {
    this.requestingAvaliations = false
    this.loading.hideLoading();
    if (this.avaliations.length > 1) {
      this.toast.showToast("Exibindo " + this.avaliations.length.toString() + " avaliações!");
    }
  }

  private onError() {
    this.requestingAvaliations = false
    this.loading.hideLoading();
    this.toast.showToast("Erro ao buscar avaliações!");
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

  onFilterChange() {
    this.requestingAvaliations = true
    this.avaliations = new Array<Avaliation>()
    switch (this.avaliationType) {
      case "Avaliações feitas":
        this.getDoneAvaliations();
        break;
      case "Avaliações recebidas":
        this.getReceivedAvaliations();
        break;
      default:
        this.getAllAvaliations();
        break;
    }
  }
}
