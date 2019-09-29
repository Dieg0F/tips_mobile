import { Constants } from './../../../util/constants/constants';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';

@IonicPage()
@Component({
  selector: 'page-user-solicitations',
  templateUrl: 'user-solicitations.html',
})
export class UserSolicitationsPage {

  public solicitations: Array<Solicitation> = new Array<Solicitation>();
  public allSolicitations: Array<Solicitation> = new Array<Solicitation>();

  public userId = AppConfig.USER_PROFILE.uid;

  public filterType = Constants.ALL_SOLICITATIONS;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public solicitationProvider: SolicitationProvider) {
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
        await this.solicitationProvider.getDoneSolicitations(this.userId)
          .then(async (d) => {
            var dSubs = await d.subscribe(async (dsolicitations: Array<Solicitation>) => {
              await this.solicitationProvider.getReceivedSolicitations(this.userId)
                .then(async (r) => {
                  var rSubs = await r.subscribe(async (rSolicitations: Array<Solicitation>) => {
                    this.buildList(rSolicitations, dsolicitations, rSubs, dSubs);
                  })
                })
            });
          })
          .catch((err) => {
            console.log(err);
            this.onError();
          })
      })
  }

  private buildList(rSolicitations: Solicitation[], dsolicitations: Solicitation[], rSubs: any, dSubs: any) {
    var allList = rSolicitations.concat(dsolicitations);
    this.allSolicitations = allList.filter((a) => {
      if ((a.removedTo.contractorUid != null && a.removedTo.contractorUid != this.userId) ||
        a.removedTo.hiredUid != null && a.removedTo.hiredUid != this.userId) {
        return a;
      }
    });
    this.solicitations = this.allSolicitations;
    rSubs.unsubscribe();
    dSubs.unsubscribe();
    this.onSuccess();
  }

  private async onSuccess() {
    await this.loading.hideLoadingPromise();
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

  goToDetails(solicitation: any) {
    if (solicitation.contractorUid == this.userId) {
      this.navCtrl.push('SolicitationDetailsPage', { 'solicitation': solicitation })
    } else {
      this.navCtrl.push('SolicitationManagerPage', { 'solicitation': solicitation })
    }
  }

  onFilterChange() {
    this.solicitations = new Array<Solicitation>();
    switch (this.filterType) {
      case Constants.ALL_SOLICITATIONS:
        this.getAllSolicitations();
        break;
      case Constants.SOLICITATIONS_RECEIVED:
        this.getReceivedSolicitations();
        break;
      case Constants.SOLICITATIONS_DONE:
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
      case Constants.SOLICITATION_IS_OPEN:
        statusClass += "newSolicitation";
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusClass += "runningSolicitation";
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusClass += "finishedSolicitation";
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusClass += "canceledSolicitation";
        break;
    }

    return statusClass;
  }

  setStatusValueToShow(status): string {
    var statusValue = ""

    switch (status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusValue += "Cancelado";
        break;
    }

    return statusValue;
  }
}
