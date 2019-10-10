import { Constants } from './../../../util/constants/constants';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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

  public profile = AppConfig.USER_PROFILE;

  public filterType = Constants.ALL_SOLICITATIONS;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public events: Events,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public solicitationProvider: SolicitationProvider) {
  }

  ionViewWillEnter() {
    this.getSolicitations();
    this.onFilterChange();
    this.events.subscribe("NEW_SOLICITATION", () => {
      this.updateListOnEvent();
    })
    this.events.subscribe("CHANGE_SOLICITATION", () => {
      this.updateListOnEvent();
    })
  }

  ionViewWillLeave() {
    this.events.unsubscribe("NEW_SOLICITATION");
    this.events.unsubscribe("CHANGE_SOLICITATION");
  }

  updateListOnEvent() {
    console.log("On Event!");
    this.solicitationProvider.getDoneSolicitations(this.profile.uid)
      .then(async (d) => {
        var dSubs = await d.subscribe(async (dSolicitations: Array<Solicitation>) => {
          await this.solicitationProvider.getReceivedSolicitations(this.profile.uid)
            .then(async (r) => {
              var rSubs = await r.subscribe(async (rSolicitations: Array<Solicitation>) => {
                this.filterRemovedSolicitations(dSolicitations, rSolicitations);
                rSubs.unsubscribe();
                dSubs.unsubscribe();
                this.onFilterChange();
                this.toast.showToast("Você recebeu novas solicitações!");
              })
            })
        });
      })
  }

  getSolicitations() {
    this.solicitations = new Array<Solicitation>();
    this.allSolicitations = new Array<Solicitation>();
    this.loading.showLoading("Buscando serviços...")
      .then(async () => {
        await this.solicitationProvider.getDoneSolicitations(this.profile.uid)
          .then(async (d) => {
            var dSubs = await d.subscribe(async (dSolicitations: Array<Solicitation>) => {
              await this.solicitationProvider.getReceivedSolicitations(this.profile.uid)
                .then(async (r) => {
                  var rSubs = await r.subscribe(async (rSolicitations: Array<Solicitation>) => {
                    this.buildList(rSolicitations, dSolicitations, rSubs, dSubs);
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

  private buildList(rSolicitations: Solicitation[], dSolicitations: Solicitation[], rSubs: any, dSubs: any) {
    this.filterRemovedSolicitations(dSolicitations, rSolicitations);
    rSubs.unsubscribe();
    dSubs.unsubscribe();
    this.onSuccess();
  }

  private filterRemovedSolicitations(dSolicitations: Solicitation[], rSolicitations: Solicitation[]) {
    var allDoneList = dSolicitations.filter((d) => {
      if (d.removedTo.contractorUid !== this.profile.uid) {
        d.name = "Solicitação para " + d.profileNames.hiredName;
        return d;
      }
    });
    var allReceivedList = rSolicitations.filter((r) => {
      if (r.removedTo.hiredUid !== this.profile.uid) {
        r.name = "Solicitação de " + r.profileNames.contractorName;
        return r;
      }
    });
    this.solicitations = this.allSolicitations = allDoneList.concat(allReceivedList);
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
    if (solicitation.contractorUid == this.profile.uid) {
      this.navCtrl.push('SolicitationDetailsPage', { 'solicitation': solicitation })
    } else {
      this.navCtrl.push('SolicitationManagerPage', { 'solicitation': solicitation })
    }
  }

  onFilterChange() {
    console.log("On Filter Change: ", this.filterType);
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
      if (el.hiredUid == this.profile.uid) {
        this.solicitations.push(el);
      }
    })
  }

  private getDoneSolicitations() {
    this.allSolicitations.forEach(el => {
      if (el.contractorUid == this.profile.uid) {
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
