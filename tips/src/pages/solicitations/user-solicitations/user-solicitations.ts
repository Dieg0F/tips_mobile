import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { AppConfig } from '../../../model/static/static';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from './../../../util/constants/constants';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-user-solicitations',
  templateUrl: 'user-solicitations.html',
})
export class UserSolicitationsPage {

  public solicitations: Solicitation[] = new Array<Solicitation>();
  public allSolicitations: Solicitation[] = new Array<Solicitation>();
  public profile = AppConfig.USER_PROFILE;
  public filterType = Constants.ALL_SOLICITATIONS;

  constructor(
    public navCtrl: NavController,
    public toast: Toast,
    public events: Events,
    public loading: Loading,
    public solicitationProvider: SolicitationProvider) {
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getSolicitations();
    this.onFilterChange();
    this.events.subscribe('NEW_SOLICITATION', () => {
      this.updateListOnEvent();
    });
    this.events.subscribe('CHANGE_SOLICITATION', (data: string) => {
      this.updateListOnEvent(data);
    });
  }

  /**
   * @description on page will leave.
   */
  public ionViewWillLeave() {
    this.events.unsubscribe('NEW_SOLICITATION');
    this.events.unsubscribe('CHANGE_SOLICITATION');
  }

  /**
   * @description uodate solicitation list by event.
   * @param data new solicitation id.
   */
  public updateListOnEvent(data?: string) {
    this.solicitationProvider.getDoneSolicitations(this.profile.uid)
      .then(async (d) => {
        const dSubs = await d.subscribe(async (dSolicitations: Solicitation[]) => {
          await this.solicitationProvider.getReceivedSolicitations(this.profile.uid)
            .then(async (r) => {
              const rSubs = await r.subscribe(async (rSolicitations: Solicitation[]) => {
                this.filterRemovedSolicitations(dSolicitations, rSolicitations);
                rSubs.unsubscribe();
                dSubs.unsubscribe();
                this.onFilterChange();
                if (data) {
                  const sol = this.solicitations.filter((s) => {
                    return s.uId === data ? s : null;
                  });
                  if (sol && sol[0].removedTo.hiredUid !== AppConfig.USER_PROFILE.uid) {
                    this.toast.showToast('Você recebeu novas solicitações!');
                  }
                } else {
                  this.toast.showToast('Você recebeu novas solicitações!');
                }
              });
            });
        });
      });
  }

  /**
   * @description request all user solicitations.
   */
  public getSolicitations() {
    this.solicitations = new Array<Solicitation>();
    this.allSolicitations = new Array<Solicitation>();
    this.loading.showLoading('Buscando serviços...')
      .then(async () => {
        await this.solicitationProvider.getDoneSolicitations(this.profile.uid)
          .then(async (d) => {
            const dSubs = await d.subscribe(async (dSolicitations: Solicitation[]) => {
              await this.solicitationProvider.getReceivedSolicitations(this.profile.uid)
                .then(async (r) => {
                  const rSubs = await r.subscribe(async (rSolicitations: Solicitation[]) => {
                    this.buildList(rSolicitations, dSolicitations, rSubs, dSubs);
                  });
                });
            });
          })
          .catch((err) => {
            this.onError();
          });
      });
  }

  /**
   * @description redirect user to solicitation details.
   * @param solicitation solicitation to be showed on details.
   */
  public goToDetails(solicitation: any) {
    if (solicitation.contractorUid === this.profile.uid) {
      this.navCtrl.push('SolicitationDetailsPage', { solicitation });
    } else {
      this.navCtrl.push('SolicitationManagerPage', { solicitation });
    }
  }

  /**
   * @description handle when user select some option on filter.
   */
  public onFilterChange() {
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

  /**
   * @description set solicitation view class by status.
   * @param status solicitation status.
   */
  public setSolicitationStatusClass(status: string) {
    let statusClass = ' ';

    switch (status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusClass += 'newSolicitation';
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusClass += 'runningSolicitation';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusClass += 'finishedSolicitation';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusClass += 'canceledSolicitation';
        break;
    }

    return statusClass;
  }
  /**
   * @description build a string based on solicitation status.
   * @param status solicitation status.
   */
  public setStatusValueToShow(status): string {
    let statusValue = '';

    switch (status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusValue += 'Novo';
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusValue += 'Em Andamento';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusValue += 'Finalizado';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusValue += 'Cancelado';
        break;
    }

    return statusValue;
  }

  /**
   * @description build a full solicitation list.
   * @param rSolicitations received solicitation list.
   * @param dSolicitations done solicitation list.
   * @param rSubs receive solicitation observable.
   * @param dSubs done solicitation observable.
   */
  private buildList(rSolicitations: Solicitation[], dSolicitations: Solicitation[], rSubs: any, dSubs: any) {
    this.filterRemovedSolicitations(dSolicitations, rSolicitations);
    rSubs.unsubscribe();
    dSubs.unsubscribe();
    this.onSuccess();
  }

  /**
   * @description filter all removed solicitation on list.
   * @param rSolicitations received solicitation list.
   * @param dSolicitations done solicitation list.
   */
  private filterRemovedSolicitations(dSolicitations: Solicitation[], rSolicitations: Solicitation[]) {
    const allDoneList = dSolicitations.filter((d) => {
      if (d.removedTo.contractorUid !== this.profile.uid) {
        d.name = 'Solicitação para ' + d.profileNames.hiredName;
        return d;
      }
    });
    const allReceivedList = rSolicitations.filter((r) => {
      if (r.removedTo.hiredUid !== this.profile.uid) {
        r.name = 'Solicitação de ' + r.profileNames.contractorName;
        return r;
      }
    });
    this.solicitations = this.allSolicitations = allDoneList.concat(allReceivedList);
  }

  /**
   * @description show success messages and flow.
   */
  private async onSuccess() {
    await this.loading.hideLoadingPromise();
  }

  /**
   * @description show error messages and flow.
   */
  private onError() {
    this.loading.hideLoadingPromise()
      .then(() => {
        this.toast.showToast('Erro ao buscar serviços!');
      })
      .catch(() => {
        // tslint:disable-next-line:no-console
        console.log('Error loading solicitations');
      });
  }

  /**
   * @description filter all received solicitations.
   */
  private getReceivedSolicitations() {
    this.allSolicitations.forEach((el) => {
      if (el.hiredUid === this.profile.uid) {
        this.solicitations.push(el);
      }
    });
  }

  /**
   * @description filter all received solicitations.
   */
  private getDoneSolicitations() {
    this.allSolicitations.forEach((el) => {
      if (el.contractorUid === this.profile.uid) {
        this.solicitations.push(el);
      }
    });
  }

  /**
   * @description filter all solicitations.
   */
  private getAllSolicitations() {
    this.solicitations = this.allSolicitations;
  }

  /**
   * @description filter all solicitations by status.
   */
  private getSolicitationsByStatus(status: string) {
    this.allSolicitations.forEach((el) => {
      if (el.status === status) {
        this.solicitations.push(el);
      }
    });
  }
}
