import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Service } from '../../../model/service/service';
import { Constants } from '../../../util/constants/constants';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { ServiceProvider } from '../../../providers/service/service';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { UUID } from 'angular2-uuid';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { Loading } from '../../../util/loading/loading';

@IonicPage()
@Component({
  selector: 'page-new-avaliation',
  templateUrl: 'new-avaliation.html',
})
export class NewAvaliationPage {

  public avaliation: Avaliation;
  public avaliationRate: number = 1;
  public avaliationBody: string = "";

  public service: Service;
  public contractorProfile: Profile;
  public hiredProfile: Profile;

  public userUid = AppConfig.USER_PROFILE.uid;

  public asContractor: boolean = true;

  public starActiveColor = "#CD7F32";
  public starOutlineColor = "#CD7F32";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public events: Events,
    public toast: Toast,
    public serviceProvider: ServiceProvider,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getProfiles();
  }

  ratingEvent(rating) {
    if (rating < 2) {
      this.starActiveColor = "#CD7F32";
      this.starOutlineColor = "#CD7F32";
    } else if (rating >= 2 && rating < 4) {
      this.starActiveColor = "#C0C0C0";
      this.starOutlineColor = "#C0C0C0";
    } else if (rating >= 4) {
      this.starActiveColor = "#DAA520";
      this.starOutlineColor = "#DAA520";
    }
    this.avaliationRate = rating;
  }

  async getProfiles() {
    this.loading.showLoading("Preparando avaliação...")
      .then(async () => {
        this.service = this.navParams.get(Constants.SERVICE_DETAILS);

        var profileUidToRequest = "";

        if (this.service.contractorUid == this.userUid) {
          this.contractorProfile = { ...AppConfig.USER_PROFILE }
          profileUidToRequest = this.service.hiredUid;
          this.asContractor = true;
        } else {
          this.hiredProfile = { ...AppConfig.USER_PROFILE }
          profileUidToRequest = this.service.contractorUid;
        }

        await this.requestingAllProfiles(profileUidToRequest);
      })
      .catch(() => {
        this.toast.showToast("Erro ao buscar perfil a avaliar!");
        this.navCtrl.pop();
      })
  }

  private async requestingAllProfiles(profileUidToRequest: string) {
    await this.profileProvider.getProfile(profileUidToRequest)
      .then(async (res) => {
        if (this.contractorProfile == undefined || this.contractorProfile == null) {
          this.contractorProfile = res.data();
        }
        else {
          this.hiredProfile = res.data();
        }
        return await this.getOlderAvaliation();
      })
      .catch(() => {
        this.loading.hideLoadingPromise()
          .then(() => {
            this.toast.showToast("Erro ao buscar perfil a avaliar!");
            this.navCtrl.pop();
          })
      });
  }

  async getOlderAvaliation() {
    return await this.avaliationProvider.getAvaliationByUser(this.contractorProfile.uid, this.hiredProfile.uid)
      .then(async (res) => {
        return this.loading.hideLoadingPromise()
          .then(async () => {
            await res.subscribe(async (avaliation: Array<Avaliation>) => {
              if (avaliation.length > 0) {
                this.avaliation = avaliation[0];
                this.avaliationRate = this.avaliation.rate;
                this.avaliationBody = this.avaliation.body;
                this.ratingEvent(this.avaliationRate);
              } else {
                this.buildAvaliation()
              }
            })
          });
      });
  }

  buildAvaliation() {
    let newAvaliation: Avaliation = {
      uId: UUID.UUID(),
      evaluatorUid: this.userUid,
      ratedUid: (this.asContractor) ? this.hiredProfile.uid : this.contractorProfile.uid,
      serviceUid: this.service.serviceId,
      body: "",
      rate: 1,
      date: ""
    }

    this.avaliation = newAvaliation;
  }

  async finish() {
    this.avaliation.date = Date.now().toLocaleString();
    this.avaliation.rate = this.avaliationRate;
    this.avaliation.body = this.avaliationBody;
    await this.loading.showLoading("Salvando avaliação...")
      .then(async () => {
        return await this.avaliationProvider.saveAvaliation(this.avaliation)
          .then(async () => {
            await this.updateService(this.avaliation.uId);
          })
          .catch(() => {
            this.onError();
          })
      })
      .catch(() => {
        console.log("Error on loading SavingAvaliation");
      });
  }

  async updateService(avaliationUid: string): Promise<any> {
    this.service.avaliationUid = avaliationUid;
    return await this.serviceProvider.updateService(this.service)
      .then(async () => {
        await this.onSuccess();
      })
  }

  async onSuccess() {
    setTimeout(async () => {
      await this.loading.hideLoadingPromise();
      await this.navCtrl.pop();
      await this.toast.showToast("Avaliação concluída!");
    }, 1000)
  }

  onError() {
    this.loading.hideLoadingPromise()
      .then(async () => {
        this.toast.showToast("Erro ao salvar avaliação!");
      })
  }
}
