import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { UUID } from 'angular2-uuid';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { Loading } from '../../../util/loading/loading';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';

@IonicPage()
@Component({
  selector: 'page-new-avaliation',
  templateUrl: 'new-avaliation.html',
})
export class NewAvaliationPage {

  public avaliation: Avaliation;
  public avaliationRate: number = 1;
  public avaliationBody: string = "";

  public solicitation: Solicitation;
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
    public serviceProvider: SolicitationProvider,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getProfiles();
  }

  ratingEvent(rating: number) {
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
        this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);

        var profileUidToRequest = "";

        if (this.solicitation.contractorUid == this.userUid) {
          this.contractorProfile = { ...AppConfig.USER_PROFILE }
          profileUidToRequest = this.solicitation.hiredUid;
          this.asContractor = true;
        } else {
          this.hiredProfile = { ...AppConfig.USER_PROFILE }
          profileUidToRequest = this.solicitation.contractorUid;
          this.asContractor = false;
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
            this.toast.showToast("Erro ao montar avaliação!");
            this.navCtrl.pop();
          })
      });
  }

  async getOlderAvaliation() {
    return await this.avaliationProvider.getAvaliationById(this.createAvaliationUid())
      .then(async (res) => {
        this.loading.hideLoadingPromise()
          .then(async () => {
            if (res.data()) {
              this.avaliation = res.data();
              this.avaliationRate = this.avaliation.rate;
              this.avaliationBody = this.avaliation.body;
              this.ratingEvent(this.avaliationRate);
            } else {
              this.buildAvaliation();
            }
          });
      });
  }

  buildAvaliation() {
    let newAvaliation: Avaliation = {
      uId: this.createAvaliationUid(),
      evaluatorUid: this.userUid,
      ratedUid: (this.asContractor) ? this.hiredProfile.uid : this.contractorProfile.uid,
      serviceUid: this.solicitation.solicitationId,
      name: "",
      profileNames: {
        evaluatorName: this.contractorProfile.name.firstName + " " + this.contractorProfile.name.lastName,
        ratedName: this.hiredProfile.name.firstName + " " + this.hiredProfile.name.lastName,
      },
      body: "",
      rate: 1,
      date: 0
    }

    this.avaliation = newAvaliation;
  }

  private createAvaliationUid() {
    var avaliationUid: string;
    if (this.asContractor) {
      avaliationUid = this.solicitation.contractorUid + this.solicitation.hiredUid;
    }
    else {
      avaliationUid = this.solicitation.hiredUid + this.solicitation.contractorUid;
    }
    return avaliationUid;
  }

  async finish() {
    this.avaliation.date = parseInt(Date.now().toString());
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
    if (this.asContractor) {
      this.solicitation.avaliatedTo.contractorAvaliation = avaliationUid;
    } else {
      this.solicitation.avaliatedTo.hiredAvaliation = avaliationUid;
    }
    return await this.serviceProvider.updateSolicitation(this.solicitation)
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
