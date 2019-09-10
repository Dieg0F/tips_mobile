import { Constants } from './../../../util/constants/constants';
import { Component, ɵConsole } from '@angular/core';
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

  public hideOptions: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public avaliationsProvider: AvaliationProvider) {
    this.getOwnerUid();
    this.onFilterChange();
  }

  getOwnerUid() {
    if (!this.navParams.get(Constants.AVALIATION_HIDE_DETAILS)) {
      this.hideOptions = false;
    } else {
      this.hideOptions = true;
    }

    if (!this.navParams.get(Constants.AVALIATION_OWNER_ID)) {
      this.ownerAvaliationsUid = AppConfig.USER_PROFILE.uid;
    } else {
      this.ownerAvaliationsUid = this.navParams.get(Constants.AVALIATION_OWNER_ID);
    }
  }

  getReceivedAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
          .then((res) => {
            res.subscribe((avaliations: Array<Avaliation>) => {
              this.avaliations = avaliations;
            })
          })
          .catch((err) => {
            console.log(err);
            this.onError()
          })
      })
      .catch(() => {
        console.log("Error on loading GetReceivedAvaliations");
      })
  }

  getDoneAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
          .then((res) => {
            res.subscribe((avaliations: Array<Avaliation>) => {
              console.log(avaliations)
              this.avaliations = avaliations;
              this.onSuccess();
            })
          })
          .catch((err) => {
            console.log(err);
            this.onError();
          })
      })
      .catch(() => {
        console.log("Error on loading GetDoneAvaliations");
      })
  }

  getAllAvaliations() {
    this.loading.showLoading("Buscando Avaliações...")
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
          .then((received) => {
            received.subscribe((receivedAvaliations: Array<Avaliation>) => {
              return this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
                .then((done) => {
                  done.subscribe((doneAvaliations: Array<Avaliation>) => {
                    doneAvaliations.forEach(doneAvaliation => {
                      this.avaliations.push(doneAvaliation);
                    });
                    receivedAvaliations.forEach(receivedAvaliation => {
                      this.avaliations.push(receivedAvaliation);
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
      })
      .catch(() => {
        console.log("Error on loading GetAvaliations");
      })
  }

  private onSuccess() {
    this.loading.hideLoading();
  }

  private onError() {
    this.loading.hideLoadingPromise()
      .then(() => {
        this.toast.showToast("Erro ao buscar avaliações!");
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

  goToDetails(avaliation: Avaliation) {
    var profileUidToRequest = "";

    if (avaliation.contractorUid == this.ownerAvaliationsUid) {
      profileUidToRequest = avaliation.hiredUid
    } else {
      profileUidToRequest = avaliation.contractorUid
    }

    this.profileProvider.getProfile(profileUidToRequest)
      .then((res) => {
        this.navCtrl.push('AvaliationDetailsPage', { 'avaliation': avaliation, 'avaliationOwner': res.data() })
      })
      .catch(() => {
        this.toast.showToast("Erro ao exibir detalhes da avaliação!")
      })
  }

  onFilterChange() {
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
