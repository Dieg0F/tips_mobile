import { Constants } from './../../../util/constants/constants';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../../providers/service/service';
import { Service } from '../../../model/service/service';
import { AppConfig } from '../../../model/static/static';
import { Solicitation } from '../../../model/solicitation/solicitation';

@IonicPage()
@Component({
  selector: 'page-user-solicitations',
  templateUrl: 'user-solicitations.html',
})
export class UserSolicitationsPage {

  public solicitations: Array<Solicitation> = new Array<Solicitation>();
  public allSolicitations: Array<Solicitation> = new Array<Solicitation>();

  public userId = AppConfig.USER_PROFILE.uid;

  public filterType = Constants.ALL_SERVICES;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public serviceProvider: ServiceProvider) {
  }

  ionViewWillEnter() {
    this.getSolicitations();
    this.onFilterChange();
  }

  getSolicitations() {
    this.solicitations = new Array<Solicitation>();
    this.allSolicitations = new Array<Solicitation>();
    this.loading.showLoading("Buscando serviços...")
      .then(async () => {
        await this.serviceProvider.getServices(this.userId)
          .then(async (res) => {
            var subs = await res.subscribe(async (values) => {
              this.allSolicitations = values;
              this.solicitations = values;
              this.onSuccess(subs);
            });
          })
          .catch((err) => {
            console.log(err);
            this.onError();
          })
      })
  }

  private async onSuccess(action) {
    await this.loading.hideLoadingPromise()
      .then(async () => {
        action.unsubscribe();
      })
      .catch((err) => {
        console.log("Error loading solicitations, err: ", err);
      })
  }

  private onError() {
    this.loading.hideLoadingPromise()
      .then(() => {
        this.toast.showToast("Erro ao buscar serviços!");
      })
      .catch(() => {
        console.log("Error loading solicitations");
      })
  }

  goToDetails(service: any) {
    if (service.contractorUid == this.userId) {
      this.navCtrl.push('SolicitationDetailsPage', { 'service': service })
    } else {
      this.navCtrl.push('SolicitationManagerPage', { 'service': service })
    }
  }

  onFilterChange() {
    this.solicitations = new Array<Solicitation>()
    switch (this.filterType) {
      case Constants.ALL_SERVICES:
        this.getAllSolicitations();
        break;
      case Constants.SERVICES_RECEIVED:
        this.getReceivedSolicitations();
        break;
      case Constants.SERVICES_DONE:
        this.getDoneSolicitations();
        break;
      default:
        this.getSolicitationsByStatus(this.filterType);
        break;
    }
  }

  private getReceivedSolicitations() {
    this.allSolicitations.forEach(el => {
      if (el.hiredUid == this.userId) {
        this.solicitations.push(el);
      }
    })
  }

  private getDoneSolicitations() {
    this.allSolicitations.forEach(el => {
      if (el.contractorUid == this.userId) {
        this.solicitations.push(el);
      }
    })
  }

  private getAllSolicitations() {
    this.solicitations = this.allSolicitations;
  }

  private getSolicitationsByStatus(status: string) {
    this.allSolicitations.forEach(el => {
      if (el.status == status) {
        this.solicitations.push(el);
      }
    })
  }

  setSolicitationStatusClass(status: string) {
    var statusClass = " "

    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        statusClass += "newSolicitation";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusClass += "runningSolicitation";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusClass += "finishedSolicitation";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusClass += "canceledSolicitation";
        break;
    }

    return statusClass;
  }

  setStatusValueToShow(status): string {
    var statusValue = ""

    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusValue += "Cancelado";
        break;
    }

    return statusValue;
  }
}
