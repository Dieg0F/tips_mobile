import { SectorProvider } from '../../../providers/sector/sector';
import { StarRateHelper } from './../../../util/stars-rate/stars-rate';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Locations } from '../../../providers/locations/locations';
import { Toast } from '../../../util/toast/toast';
import { Loading } from '../../../util/loading/loading';
import { FilterOptions } from '../../../model/FilterOptions/FilterOptions';
import { AppConfig } from '../../../model/static/static';
import { Profile } from '../../../model/profile/profile';
import { AreaProvider } from '../../../providers/area/area';
import { Sector } from '../../../model/sector/sector';
import { Constants } from '../../../util/constants/constants';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public pageTiitle = "Busca por profissionais";
  public itemsForPage = 10;
  public itemsOnPage = 0;

  public profileName = "";

  public states = [];

  public stateSelected: string = Constants.DEFAULT_VALUE_FOR_STATE_SEARCH;
  public citySelected: string = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
  public jobSelected: string = Constants.DEFAULT_VALUE_FOR_JOB_SEARCH;
  public rateSelected: string = Constants.DEFAULT_VALUE_FOR_RATE_SEARCH;

  public hasStateSelected: boolean = false;
  public stateId: number = 0;

  public filterOptions: FilterOptions;

  public searchMode: string = Constants.SEARCH_BASIC;

  public starsRateHelper: StarRateHelper;

  public sectors: Array<Sector> = [];
  public profiles: Array<Profile> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    public toast: Toast,
    public loading: Loading,
    public areaProvider: AreaProvider,
    public sectorsProvider: SectorProvider,
    public events: Events,
    public profileProvider: ProfileProvider) {
    this.starsRateHelper = new StarRateHelper;
    this.filterOptions = new FilterOptions;
  }

  ionViewWillEnter() {
    this.loading.showLoading("Preparando busca...")
      .then(() => {
        this.getSectors();
      })
  }

  private onRateSelected() {
    this.events.subscribe('rateSelected', async (rate: number) => {
      console.log(rate)
      if (rate != undefined) {
        this.filterOptions.profileRate = rate;
        this.rateSelected = rate + " estrelas";
      }
      else {
        this.filterOptions.profileRate = undefined;
        this.rateSelected = Constants.DEFAULT_VALUE_FOR_RATE_SEARCH;
      }
      this.events.unsubscribe('rateSelected');
    });
  }

  private onCitySelected() {
    this.events.subscribe('citySelected', async (city: string) => {
      console.log("City: ", city);
      if (city != undefined) {
        this.filterOptions.profileCity = city;
        this.citySelected = city;
      }
      else {
        this.filterOptions.profileCity = undefined;
        this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
      }
      this.events.unsubscribe('citySelected');
    });
  }

  private onStateSelected() {
    this.events.subscribe('stateSelected', async (state: any) => {
      if (state != undefined) {
        this.filterOptions.profileState = state.sigla;
        this.stateSelected = state.sigla;
        this.hasStateSelected = true;
        this.stateId = state.id;
      }
      else {
        this.hasStateSelected = false;
        this.filterOptions.profileState = undefined;
        this.filterOptions.profileCity = undefined;
        this.stateSelected = Constants.DEFAULT_VALUE_FOR_STATE_SEARCH;
        this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
      }
      this.events.unsubscribe('stateSelected');
    });
  }

  private onJobSelected() {
    this.events.subscribe('jobSelected', async (job: string) => {
      if (job != undefined) {
        this.filterOptions.profileSector = job;
        this.jobSelected = job;
      }
      else {
        this.filterOptions.profileSector = undefined;
        this.jobSelected = Constants.DEFAULT_VALUE_FOR_JOB_SEARCH;
      }
      this.events.unsubscribe('jobSelected');
    });
  }

  getSectors() {
    this.sectors = new Array<Sector>();
    this.sectorsProvider.getSectors()
      .then((res) => {
        res.subscribe(values => {
          this.sectors = values;
          this.loading.hideLoading();
        });

      })
      .catch((err) => {
        console.log("Erro: ", err);
        this.toast.showToast("Erro ao preparar busca, Profissiões não encontradas! ");
      });
  }

  getStates() {
    this.locations.getStates()
      .then((res) => {
        this.states = res
      })
      .catch(() => {
        this.toast.showToast("Estado não encontrado! ");
      })
  }

  changeSearchMode() {
    this.stateSelected = Constants.DEFAULT_VALUE_FOR_STATE_SEARCH;
    this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
    this.jobSelected = Constants.DEFAULT_VALUE_FOR_JOB_SEARCH;
    this.rateSelected = Constants.DEFAULT_VALUE_FOR_RATE_SEARCH;

    this.hasStateSelected = false;
    this.stateId = 0;

    this.filterOptions = new FilterOptions;
    this.searchMode == Constants.SEARCH_BASIC ? this.searchMode = Constants.SEARCH_COMPLETE : this.searchMode = Constants.SEARCH_BASIC;
  }

  createFilter() {
    if (this.filterOptions.profileCity == undefined) {
      this.filterOptions.profileCity = AppConfig.USER_PROFILE.cidade;
    }

    if (this.filterOptions.profileState == undefined) {
      this.filterOptions.profileState = AppConfig.USER_PROFILE.estado;
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
        this.searchMode = Constants.SEARCH_BASIC;
        this.toast.showToast(`Ops, erro ao buscar profissionais!`);
      });
  }

  results(values: any) {
    this.profiles = new Array<Profile>();
    var profileFiltered = new Array<Profile>();
    if (this.profileName != undefined && this.profileName != "" && this.profileName != null) {
      profileFiltered = values.filter((profile: Profile) => {
        return (profile.nome.toLowerCase().indexOf(this.profileName.toLowerCase()) > -1);
      })
    } else {
      profileFiltered = values
    }
    this.buildList(profileFiltered);
    if (this.profiles.length > 0) {
      this.pageTiitle = "Resultado da busca"
      this.searchMode = Constants.SEARCH_DISABLED;
    } else {
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

  searchAgain() {
    this.pageTiitle = "Busca por profissionais"
    this.searchMode = Constants.SEARCH_BASIC;
    this.itemsForPage = 10;
    this.itemsOnPage = 0;
  }

  selectJob() {
    this.onJobSelected();
    this.navCtrl.push("JobSearchPage", { 'jobList': this.sectors });
  }

  selectRate() {
    this.onRateSelected();
    this.navCtrl.push("RatingSearchPage");
  }

  selectState() {
    this.onStateSelected();
    this.navCtrl.push("StateSearchPage", { 'stateList': this.states });
  }

  selectCity() {
    this.onCitySelected();
    this.navCtrl.push("CitySearchPage", { 'stateId': this.stateId });
  }

  goToDetails(profile: any) {
    this.navCtrl.push("ProfileDetailsPage", { 'profile': profile })
  }
}
