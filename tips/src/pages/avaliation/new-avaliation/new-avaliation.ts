import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  public service: Service;
  public contractorProfile: Profile;
  public hiredProfile: Profile;

  public userUid = AppConfig.USER_PROFILE.uid;

  public asContractor: boolean = true;

  public avaliationTitle = "";
  public avaliationDescription = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public toast: Toast,
    public serviceProvider: ServiceProvider,
    public avaliationProvider: AvaliationProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getServices();
  }

  getServices() {
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

    this.profileProvider.getProfile(profileUidToRequest)
      .then((res) => {
        if (this.contractorProfile == undefined || this.contractorProfile == null) {
          this.contractorProfile = res.data();
        } else {
          this.hiredProfile = res.data();
        }
      })
  }

  buildAvaliation() {
    let avaliation: Avaliation = {
      uId: UUID.UUID(),
      contractorUid: this.contractorProfile.uid,
      hiredUid: this.hiredProfile.uid,
      serviceUid: this.service.serviceId,
      body: this.avaliationDescription,
      rate: 0,
      date: Date.now().toLocaleString()
    }

    return avaliation;
  }

  async finish() {
    var avaliation = this.buildAvaliation();
    this.loading.showLoading("Salvando avaliação...");
    await this.avaliationProvider.saveAvaliation(avaliation)
      .then(async () => {
        this.updateService(avaliation.uId);
      })
      .catch(() => {
        this.onError();
      })
  }

  async updateService(avaliationUid: string): Promise<any> {
    this.service.avaliationUid = avaliationUid;
    return await this.serviceProvider.updateService(this.service)
      .then(async () => {
        this.onSuccess()
      })
  }

  onSuccess() {
    this.loading.hideLoadingPromise()
      .then(async () => {
        await this.toast.showToast("Avaliação concluída!");
      })
  }

  onError() {
    this.loading.hideLoadingPromise()
      .then(async () => {
        await this.toast.showToast("Erro ao salvar avaliação!");
      })
  }
}
