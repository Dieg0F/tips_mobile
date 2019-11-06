import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Loading } from '../../../util/loading/loading';
import { StarRateHelper } from '../../../util/stars-rate/stars-rate';
import { Toast } from '../../../util/toast/toast';
import { Constants } from './../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-user-avaliations',
  templateUrl: 'user-avaliations.html',
})
export class UserAvaliationsPage {

  public avaliations: Avaliation[] = new Array<Avaliation>();
  public receivedAvaliations: Avaliation[] = new Array<Avaliation>();
  public doneAvaliations: Avaliation[] = new Array<Avaliation>();
  public avaliationType = Constants.ALL_AVALIAITONS;
  public ownerAvaliationsUid = '';
  public hideOptions: boolean = false;
  public profile: Profile = AppConfig.USER_PROFILE;
  public subs: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public avaliationsProvider: AvaliationProvider,
    private events: Events) {
    this.getOwnerUid();
    this.onFilterChange();
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.events.subscribe('NEW_AVALIATION', () => {
      this.onFilterChange();
      this.toast.showToast('Você recebeu novas avaliações!');
    });
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('NEW_AVALIATION');
  }

  /**
   * @description request the owner of this avaliation.
   */
  public getOwnerUid() {
    if (!this.navParams.get(Constants.AVALIATION_AS_VISITOR)) {
      this.hideOptions = false;
    } else {
      this.hideOptions = true;
      this.avaliationType = Constants.AVALIATION_RECEIVED;
    }

    if (!this.navParams.get(Constants.AVALIATION_OWNER_ID)) {
      this.ownerAvaliationsUid = AppConfig.USER_PROFILE.uid;
    } else {
      this.ownerAvaliationsUid = this.navParams.get(Constants.AVALIATION_OWNER_ID);
    }
  }

  /**
   * @description requesting avaliations that this user received.
   */
  public getReceivedAvaliations() {
    this.loading.showLoading('Buscando Avaliações...')
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
          .then((res) => {
            this.subs = res.subscribe((avaliations: Avaliation[]) => {
              this.avaliations = avaliations;
              this.setAvaliationName();
              this.onSuccess();
            });
          })
          .catch((err) => {
            this.onError();
          });
      });
  }

  /**
   * @description requesting avaliations that this user do.
   */
  public getDoneAvaliations() {
    this.loading.showLoading('Buscando Avaliações...')
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
          .then((res) => {
            this.subs = res.subscribe((avaliations: Avaliation[]) => {
              this.avaliations = avaliations;
              this.setAvaliationName();
              this.onSuccess();
            });
          })
          .catch((err) => {
            this.onError();
          });
      });
  }

  /**
   * @description requesting all user avaliations.
   */
  public getAllAvaliations() {
    this.avaliations = new Array<Avaliation>();
    this.loading.showLoading('Buscando Avaliações...')
      .then(() => {
        this.avaliationsProvider.getAvaliationByUser(null, this.ownerAvaliationsUid)
          .then((received) => {
            this.subs = received.subscribe((receivedAvaliations: Avaliation[]) => {
              return this.avaliationsProvider.getAvaliationByUser(this.ownerAvaliationsUid, null)
                .then((done) => {
                  this.subs = done.subscribe((doneAvaliations: Avaliation[]) => {
                    doneAvaliations.forEach((doneAvaliation) => {
                      this.avaliations.push(doneAvaliation);
                    });
                    receivedAvaliations.forEach((receivedAvaliation) => {
                      this.avaliations.push(receivedAvaliation);
                    });
                    this.setAvaliationName();
                    this.onSuccess();
                  });
                });
            });
          })
          .catch((err) => {
            this.loading.hideLoading();
            this.toast.showToast('Erro ao buscar avaliações!');
          });
      });
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    const starsRateHelper = new StarRateHelper();
    return starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    const starsRateHelper = new StarRateHelper();
    return starsRateHelper.starsRateColor(value);
  }

  /**
   * @description redirect user to Avaliation Details.
   * @param avaliation avaliation to be showed on large details.
   */
  public goToDetails(avaliation: Avaliation) {
    let profileUidToRequest = '';

    if (avaliation.evaluatorUid === this.ownerAvaliationsUid) {
      profileUidToRequest = avaliation.ratedUid;
    } else {
      profileUidToRequest = avaliation.evaluatorUid;
    }

    this.profileProvider.getProfile(profileUidToRequest)
      .then((res) => {
        this.navCtrl.push('AvaliationDetailsPage', { avaliation, avaliationOwner: res.data() });
      })
      .catch(() => {
        this.toast.showToast('Erro ao exibir detalhes da avaliação!');
      });
  }

  /**
   * @description when user change the filter option.
   */
  public onFilterChange() {
    this.avaliations = new Array<Avaliation>();
    switch (this.avaliationType) {
      case Constants.AVALIATION_DONE:
        this.getDoneAvaliations();
        break;
      case Constants.AVALIATION_RECEIVED:
        this.getReceivedAvaliations();
        break;
      default:
        this.getAllAvaliations();
        break;
    }
  }

  /**
   * @description Method that show success messages.
   */
  private onSuccess() {
    if (this.hideOptions) { this.subs.unsubscribe(); }
    this.loading.hideLoading();
  }

  /**
   * @description Method that show error messages.
   */
  private onError() {
    this.loading.hideLoadingPromise()
      .then(() => {
        this.toast.showToast('Erro ao buscar avaliações!');
      });
  }

  /**
   * @description set avaliation name to show on view.
   */
  private setAvaliationName() {
    let fullName = this.profile.name.firstName + ' ' + this.profile.name.lastName;
    this.avaliations.forEach((a) => {
      if (a.evaluatorUid === this.profile.uid && a.profileNames.evaluatorName === fullName) {
        a.name = 'Avaliação para ' + a.profileNames.ratedName;
      } else if (a.evaluatorUid === this.profile.uid && a.profileNames.evaluatorName !== fullName) {
        a.name = 'Avaliação para ' + a.profileNames.evaluatorName;
      } else if (a.ratedUid === this.profile.uid && a.profileNames.ratedName === fullName) {
        a.name = 'Avaliação de ' + a.profileNames.evaluatorName;
      } else if (a.ratedUid === this.profile.uid && a.profileNames.ratedName !== fullName) {
        a.name = 'Avaliação de ' + a.profileNames.ratedName;
      }
    });
    console.log(this.avaliations);
  }
}
