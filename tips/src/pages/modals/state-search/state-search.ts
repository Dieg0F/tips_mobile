import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Locations } from '../../../providers/locations/locations';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-state-search',
  templateUrl: 'state-search.html',
})
export class StateSearchPage {

  public searchQuery: string = '';
  public states: any[] = [];
  public statesFiltered: any[] = [];
  public stateSelected: string;

  constructor(
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public locations: Locations,
    public navParams: NavParams,
    public events: Events) {
    this.getStates();
  }

  /**
   * @description request all states.
   */
  public getStates() {
    this.loading.showLoading('Buscando estados...');
    this.locations.getStates()
      .then((res) => {
        this.states = res;
        this.statesFiltered = res;
        this.loading.hideLoading();
      })
      .catch(() => {
        this.loading.hideLoading();
        this.toast.showToast('Estado não encontrado! ');
      });
  }

  /**
   * @description filter all states by user typed on search field.
   * @param ev event from select filter.
   */
  public getItems(ev: any) {

    this.statesFiltered = this.states;
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.statesFiltered = this.statesFiltered.filter((state) => {
        return (state.sigla.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  /**
   * @description close this modal and emit selected state event.
   */
  public finish() {
    const filterState = this.states.filter((state: any) => {
      return state.id.toString() === this.stateSelected;
    });

    this.events.publish('stateSelected', filterState[0]);
    this.viewCtrl.dismiss();
  }

  /**
   * @description close this modal and emit empty state event.
   */
  public cancel() {
    this.events.publish('stateSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
