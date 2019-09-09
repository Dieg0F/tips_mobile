import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { Locations } from '../../../providers/locations/locations';

@IonicPage()
@Component({
  selector: 'page-state-search',
  templateUrl: 'state-search.html',
})
export class StateSearchPage {

  public searchQuery: string = '';
  public states: Array<any> = [];
  public statesFiltered: Array<any> = [];
  public stateSelected: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public locations: Locations,
    public navParams: NavParams,
    public events: Events) {
    this.getStates();
  }

  getStates() {
    this.loading.showLoading("Buscando cidades...");
    this.locations.getStates()
      .then((res) => {
        this.states = res
        this.statesFiltered = res
        this.loading.hideLoading()
      })
      .catch(() => {
        this.loading.hideLoading()
        this.toast.showToast("Cidade não encontrada! ");
      })
  }

  getItems(ev: any) {
    // Reset items back to all of the items    
    this.statesFiltered = this.states;
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.statesFiltered = this.statesFiltered.filter((state) => {
        return (state.sigla.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  finish() {
    var state = this.states.filter((state) => {
      return state.id == this.stateSelected;
    })
    this.events.publish('stateSelected', state[0]);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.events.publish('stateSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
