import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Locations } from '../../../providers/locations/locations';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-city-search',
  templateUrl: 'city-search.html',
})
export class CitySearchPage {

  public searchQuery: string = '';
  public cities: any[] = [];
  public citiesFiltered: any[] = [];
  public citySelected: string;

  constructor(
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public locations: Locations,
    public navParams: NavParams,
    public events: Events) {
    this.getCities();
  }

  /**
   * @description request all cities based on user state selected.
   */
  public getCities() {
    const stateId = this.navParams.get('stateId');
    this.loading.showLoading('Buscando cidades...');
    this.locations.getCityes(stateId)
      .then((res) => {
        this.cities = res;
        this.citiesFiltered = res;
        this.loading.hideLoading();
      })
      .catch(() => {
        this.loading.hideLoading();
        this.toast.showToast('Cidade não encontrada! ');
      });
  }

  /**
   * @description filter all cities by user typed on search field.
   * @param ev event from select filter.
   */
  public getItems(ev: any) {
    this.citiesFiltered = this.cities;
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.citiesFiltered = this.citiesFiltered.filter((city) => {
        return (city.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  /**
   * @description close this modal and emit selected city event.
   */
  public finish() {
    this.events.publish('citySelected', this.citySelected);
    this.viewCtrl.dismiss();
  }

  /**
   * @description close this modal and emit empty city event.
   */
  public cancel() {
    this.events.publish('citySelected', undefined);
    this.viewCtrl.dismiss();
  }
}
