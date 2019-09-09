import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { Locations } from '../../../providers/locations/locations';

@IonicPage()
@Component({
  selector: 'page-city-search',
  templateUrl: 'city-search.html',
})
export class CitySearchPage {

  public searchQuery: string = '';
  public cities: Array<any> = [];
  public citiesFiltered: Array<any> = [];
  public citySelected: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public locations: Locations,
    public navParams: NavParams,
    public events: Events) {
    this.getCities();
  }

  getCities() {
    var stateId = this.navParams.get("stateId");
    this.loading.showLoading("Buscando cidades...");
    this.locations.getCityes(stateId)
      .then((res) => {
        this.cities = res
        this.citiesFiltered = res
        this.loading.hideLoading()
      })
      .catch(() => {
        this.loading.hideLoading()
        this.toast.showToast("Cidade não encontrada! ");
      })
  }

  getItems(ev: any) {
    // Reset items back to all of the items    
    this.citiesFiltered = this.cities;
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.citiesFiltered = this.citiesFiltered.filter((city) => {
        return (city.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  finish() {
    this.events.publish('citySelected', this.citySelected);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.events.publish('citySelected', undefined);
    this.viewCtrl.dismiss();
  }
}
