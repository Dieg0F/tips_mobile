import { SectorProvider } from '../../../providers/sector/sector';
import { StarRateHelper } from './../../../util/stars-rate/stars-rate';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Locations } from '../../../providers/locations/locations';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { FilterOptions } from '../../../model/FilterOptions/FilterOptions';
import { AppConfig } from '../../../model/static/static';
import { Profile } from '../../../model/profile/profile';
import { AreaProvider } from '../../../providers/area/area';
import { Sector } from '../../../model/sector/sector';
import { Area } from '../../../model/area/area';

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
  public areaSelected: any;
  public sectorSelected: any;

  public filterOptions: FilterOptions;

  public searchIsOpen: boolean = true;

  public profiles = []
  private starsRateHelper: StarRateHelper;

  public sectors: Array<Sector> = [];
  public areas: Array<Area> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    public toast: Toast,
    public loading: Loading,
    public areaProvider: AreaProvider,
    public sectorsProvider: SectorProvider,
    public profileProvider: ProfileProvider) {
    this.starsRateHelper = new StarRateHelper;
    this.filterOptions = new FilterOptions;
  }

  ionViewWillEnter() {
    this.loading.showLoading("Preparando busca...")
      .then(() => {
        this.getAreas();
      })
  }

  onAreaSelect() {
    if (this.areaSelected.uId != undefined) {
      console.log(this.areaSelected);
      this.filterOptions.profileArea = this.areaSelected.name;
      this.getSectors(this.areaSelected.uId)
    }
  }

  getAreas() {
    this.areaProvider.getAreas()
      .then((areas) => {
        areas
          .subscribe(values => {
            this.areas = values;
            this.getStates();
          });
      })
      .catch((err) => {
        console.log("Erro: ", err);
        this.toast.showToast("Areas não encontradas! ");
      });
  }

  onSectorSelect() {
    if (this.sectorSelected.uId != undefined) {
      this.filterOptions.profileSector = this.sectorSelected.name;
    }
  }

  getSectors(areaUid: string) {
    this.sectors = new Array<Sector>();
    this.sectorsProvider.getSectors(areaUid)
      .then((sectors) => {
        sectors
          .subscribe(values => {
            console.log(values)
            this.sectors = values;
          });
      })
      .catch((err) => {
        console.log("Erro: ", err);
        this.toast.showToast("Setores não encontrados! ");
      });
  }

  getStates() {
    this.locations.getStates()
      .then((res) => {
        this.states = res
        this.loading.hideLoading();
      })
      .catch(() => {
        this.toast.showToast("Estado não encontrado! ");
      })
  }

  onStateSelect() {
    if (this.stateSelected.id != undefined) {
      this.filterOptions.profileState = this.stateSelected.sigla;
      this.getCites(this.stateSelected.id)
    }
  }

  getCites(stateId: number) {
    this.loading.showLoading("Buscando cidades...");
    this.locations.getCityes(stateId)
      .then((res) => {
        this.cities = res
        this.loading.hideLoading()
      })
      .catch(() => {
        this.loading.hideLoading()
        this.toast.showToast("Cidade não encontrada! ");
      })
  }

  onCitySelect() {
    if (this.stateSelected.sigla != "Todas") {
      this.filterOptions.profileCity = this.citySelected.nome;
    }
  }

  createFilter() {
    this.filterOptions.profileName = this.profileName;
    this.filterOptions.profileRate = parseInt(this.rating.toString());
    this.filterOptions.profileSector = this.setor;
    this.filterOptions.profileArea = this.areaAtuacao;

    if (this.filterOptions.profileCity == undefined) {
      this.filterOptions.profileCity = AppConfig.USER_PROFILE.cidade;
    }

    if (this.filterOptions.profileState == undefined) {
      this.filterOptions.profileState = AppConfig.USER_PROFILE.estado;
    }

    if (this.filterOptions.profileName != "") {
      this.filterOptions.profileCity = "";
      this.filterOptions.profileState = "";
    }

    this.requestProfiles();
  }

  requestProfiles() {
    this.profileProvider.getProfiles(this.filterOptions, this.itemsForPage)
      .then((res) => {
        res.subscribe((values) => {
          this.results(values)
        });
      })
      .catch(() => {
        this.searchIsOpen = true;
        this.toast.showToast(`Ops, erro ao buscar profissionais!`);
      });
  }

  results(values: any) {
    this.buildList(values);
    if (this.profiles.length > 0) {
      this.pageTiitle = "Resultado da busca"
      this.searchIsOpen = false;
    } else {
      this.searchIsOpen = true;
      this.toast.showToast(`Ops, não encontramos profissionais para essa busca!`);
    }
  }

  buildList(values) {
    if (values.length > 0) {
      values.forEach((element: Profile) => {
        if (element.uid != AppConfig.USER_PROFILE.uid) {
          this.profiles.push(element)
        }
      });
      this.itemsOnPage = this.profiles.length;
    }
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
