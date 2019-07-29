import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Locations } from '../../../providers/locations/locations';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { FilterOptions } from '../../../model/FilterOptions/FilterOptions';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public cidade = "";
  public estado = "";
  public areaAtuacao = "";
  public setor = "";
  public rating = 0;
  public profileName = "";

  public states = [];
  public cities = [];

  public stateSelected: any;
  public citySelected: any;

  public filterOptions: FilterOptions

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider) {

    this.filterOptions = new FilterOptions
  }

  ionViewWillEnter() {
    this.getStates()
  }

  getStates() {
    this.locations.getStates()
      .then((res) => {
        this.states = res
      })
      .catch(() => {
        this.toast.showToast("Stated not found! ")
      })
  }

  onStateSelect($event) {
    this.filterOptions.profileState = this.stateSelected.nome
    this.getCites(this.stateSelected.id)
  }

  getCites(stateId: number) {
    this.loading.showLoading("Buscando cidades...")
    this.locations.getCityes(stateId)
      .then((res) => {
        this.cities = res
        this.loading.hideLoading()
      })
      .catch(() => {
        this.loading.hideLoading()
        this.toast.showToast("Cities not found! ")
      })
  }

  onCitySelect($event) {
    this.filterOptions.profileCity = this.citySelected.nome    
  }

  createFilter() {

    this.filterOptions.profileName = this.profileName
    this.filterOptions.profileRate = parseInt(this.rating.toString())
    this.filterOptions.profileSector = this.setor
    this.filterOptions.profileArea = this.areaAtuacao

    this.getProfiles()
  }

  getProfiles() {
    var profiles = []

    this.profileProvider.getProfiles(this.filterOptions).then((res) => {
      res.subscribe((values) => {
        profiles = values

        console.log(profiles)
        // this.navParams.data('profiles', profiles)
        // this.navCtrl.push("ResultsPage")
      })
    })
  }

}
