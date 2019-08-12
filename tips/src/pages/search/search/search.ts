import { StarRateHelper } from './../../../util/stars-rate/stars-rate';
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

  public pageTiitle = "Busca por profissionais";
  public itemsForPage = 10;
  public itemsOnPage = 0;

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

  public searchIsOpen: boolean = true;

  public profiles = []
  private starsRateHelper: StarRateHelper

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider) {
    this.starsRateHelper = new StarRateHelper
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

  onStateSelect() {
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

  onCitySelect() {
    this.filterOptions.profileCity = this.citySelected.nome
  }

  createFilter() {
    this.filterOptions.profileName = this.profileName
    this.filterOptions.profileRate = parseInt(this.rating.toString())
    this.filterOptions.profileSector = this.setor
    this.filterOptions.profileArea = this.areaAtuacao

    this.requestProfiles()
  }

  requestProfiles() {
    this.loading.showLoading("Buscando perfis...")
    this.profileProvider.getProfiles(this.filterOptions, this.itemsForPage).then((res) => {
      res.subscribe((values) => {
        this.results(values)
      })
    })
  }

  results(values: any) {
    if (values.length > 0) {
      this.pageTiitle = "Resultado da busca"
      this.searchIsOpen = false;
      this.loading.hideLoading();
      this.buildList(values)
    } else {
      this.searchIsOpen = true;
      this.toast.showToast(`Ops, não encontramos profissionais para essa busca!`);
      this.loading.hideLoading();
    }
  }

  buildList(values) {
    this.profiles = values
    this.itemsOnPage = this.profiles.length;
  }

  doInfinite(infiniteScroll) {
    this.itemsForPage += 10;
    this.requestProfiles()
  }

  starsRate(value: number): Array<String> {
    return this.starsRateHelper.starsRate(value)
  }

  starsRateColor(value: number): String {
    return this.starsRateHelper.starsRateColor(value)
  }

  goToDetails(profile: any) {
    this.navCtrl.push("ProfileDetailsPage", { 'profile': profile })
  }

  searchAgain() {
    this.pageTiitle = "Busca por profissionais"
    this.searchIsOpen = true;
    this.itemsForPage = 10;
    this.itemsOnPage = 0;
  }
}
