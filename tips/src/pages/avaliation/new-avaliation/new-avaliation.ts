import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Avaliation } from '../../../model/avaliation/avaliation';
import { Profile } from '../../../model/profile/profile';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { AppConfig } from '../../../model/static/static';
import { AvaliationProvider } from '../../../providers/avaliation/avaliation';
import { ProfileProvider } from '../../../providers/profile/profile';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-new-avaliation',
  templateUrl: 'new-avaliation.html',
})
export class NewAvaliationPage {

  public avaliation: Avaliation;
  public avaliationRate: number = 0;
  public avaliationBody: string = '';
  public solicitation: Solicitation;
  public contractorProfile: Profile;
  public hiredProfile: Profile;
  public userUid = AppConfig.USER_PROFILE.uid;
  public asContractor: boolean = true;
  public starActiveColor = '#777777';
  public starOutlineColor = '#777777';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public events: Events,
    public toast: Toast,
    public serviceProvider: SolicitationProvider,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) { }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getProfiles();
  }

  /**
   * @description setting the star color by user selected value.
   * @param rating rate value selected by user on this view.
   */
  public ratingEvent(rating: number) {
    if (rating === 0) {
      this.starOutlineColor = this.starActiveColor = '#777777';
    } else if (rating > 0 && rating < 2) {
      this.starOutlineColor = this.starActiveColor = '#CD7F32';
    } else if (rating >= 2 && rating < 4) {
      this.starOutlineColor = this.starActiveColor = '#C0C0C0';
    } else if (rating >= 4) {
      this.starOutlineColor = this.starActiveColor = '#DAA520';
    }
    this.avaliationRate = rating;
  }

  /**
   * @description discovery witch profile will be requested.
   */
  public async getProfiles() {
    this.loading.showLoading('Preparando avaliação...')
      .then(async () => {
        this.solicitation = this.navParams.get(Constants.SOLICITATION_DETAILS);

        let profileUidToRequest = '';

        if (this.solicitation.contractorUid === this.userUid) {
          this.contractorProfile = { ...AppConfig.USER_PROFILE };
          profileUidToRequest = this.solicitation.hiredUid;
          this.asContractor = true;
        } else {
          this.hiredProfile = { ...AppConfig.USER_PROFILE };
          profileUidToRequest = this.solicitation.contractorUid;
          this.asContractor = false;
        }

        await this.requestingAllProfiles(profileUidToRequest);
      })
      .catch(() => {
        this.toast.showToast('Erro ao buscar perfil a avaliar!');
        this.navCtrl.pop();
      });
  }

  /**
   * @description get other avaliation from this user to rated user.
   */
  public async getOlderAvaliation() {
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

  /**
   * @description Build avaliation object to be saved.
   */
  public buildAvaliation() {
    const newAvaliation: Avaliation = {
      uId: this.createAvaliationUid(),
      evaluatorUid: this.userUid,
      ratedUid: (this.asContractor) ? this.hiredProfile.uid : this.contractorProfile.uid,
      serviceUid: this.solicitation.solicitationId,
      name: '',
      profileNames: {
        evaluatorName: this.contractorProfile.name.firstName + ' ' + this.contractorProfile.name.lastName,
        ratedName: this.hiredProfile.name.firstName + ' ' + this.hiredProfile.name.lastName,
      },
      body: '',
      rate: 1,
      date: 0,
    };

    this.avaliation = newAvaliation;
  }

  /**
   * @description finish avaliation session and save it on DB.
   */
  public async finish() {
    if (this.formValidation()) {
      this.avaliation.date = parseInt(Date.now().toString(), 0);
      this.avaliation.rate = this.avaliationRate;
      this.avaliation.body = this.avaliationBody;
      await this.loading.showLoading('Salvando avaliação...')
        .then(async () => {
          return await this.avaliationProvider.saveAvaliation(this.avaliation)
            .then(async () => {
              await this.updateSolicitation(this.avaliation.uId);
            })
            .catch(() => {
              this.onError();
            });
        });
    }
  }

  /**
   * @description methods that will update the service that received avaliations.
   * @param avaliationUid avaliation unique id.
   */
  public async updateSolicitation(avaliationUid: string): Promise<any> {
    if (this.asContractor) {
      this.solicitation.avaliatedTo.contractorAvaliation = avaliationUid;
    } else {
      this.solicitation.avaliatedTo.hiredAvaliation = avaliationUid;
    }
    return await this.serviceProvider.updateSolicitation(this.solicitation)
      .then(async () => {
        await this.onSuccess();
      });
  }

  /**
   * @description Method that show success messages.
   */
  public async onSuccess() {
    setTimeout(async () => {
      await this.loading.hideLoadingPromise();
      await this.navCtrl.pop();
      await this.toast.showToast('Avaliação concluída!');
    }, 1000);
  }

  /**
   * @description Method that show error messages.
   */
  public onError() {
    this.loading.hideLoadingPromise()
      .then(async () => {
        this.toast.showToast('Erro ao salvar avaliação!');
      });
  }

  /**
   * @description validating the avaliations inputs.
   */
  public formValidation() {
    if (this.avaliationRate === 0) {
      this.toast.showToast('Escolha uma nota de 1 a 5 estrelas!');
      return false;
    }
    if (!this.avaliationBody) {
      if (this.asContractor) {
        this.toast.showToast('Escreva uma avaliação sobre este profissional!');
      } else {
        this.toast.showToast('Escreva uma avaliação sobre este cliente!');
      }
      return false;
    }
    return true;
  }

  /**
   * @description requesting the other user profile.
   * @param profileUidToRequest Profile to request on Firebase.
   */
  private async requestingAllProfiles(profileUidToRequest: string) {
    await this.profileProvider.getProfile(profileUidToRequest)
      .then(async (res) => {
        if (this.contractorProfile === undefined || this.contractorProfile == null) {
          this.contractorProfile = res.data();
        } else {
          this.hiredProfile = res.data();
        }
        return await this.getOlderAvaliation();
      })
      .catch(() => {
        this.loading.hideLoadingPromise()
          .then(() => {
            this.toast.showToast('Erro ao montar avaliação!');
            this.navCtrl.pop();
          });
      });
  }

  /**
   * @description create avaliation unique ID
   */
  private createAvaliationUid() {
    let avaliationUid: string;
    if (this.asContractor) {
      avaliationUid = this.solicitation.contractorUid + this.solicitation.hiredUid;
    } else {
      avaliationUid = this.solicitation.hiredUid + this.solicitation.contractorUid;
    }
    return avaliationUid;
  }
}
