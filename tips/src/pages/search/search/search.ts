import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FilterOptions } from '../../../model/FilterOptions/FilterOptions';
import { Profile } from '../../../model/profile/profile';
import { Job } from '../../../model/job/job';
import { AppConfig } from '../../../model/static/static';
import { Locations } from '../../../providers/locations/locations';
import { ProfileProvider } from '../../../providers/profile/profile';
import { JobProvider } from '../../../providers/job/job';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { StarRateHelper } from './../../../util/stars-rate/stars-rate';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public pageTiitle = 'Busca por profissionais';
  public itemsForPage = 10;
  public itemsOnPage = 0;
  public profileName = '';
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
  public sectors: Job[] = [];
  public profiles: Profile[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public locations: Locations,
    public toast: Toast,
    public loading: Loading,
    public jobProvider: JobProvider,
    public events: Events,
    public profileProvider: ProfileProvider) {
    this.starsRateHelper = new StarRateHelper();
    this.filterOptions = new FilterOptions();
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.loading.showLoading('Preparando busca...')
      .then(() => {
        this.getJobs();
      });
  }

  /**
   * @description request all jobs from database.
   */
  public getJobs() {
    this.sectors = new Array<Job>();
    this.jobProvider.getJobs()
      .then((res) => {
        res.subscribe((values) => {
          this.sectors = values;
          this.loading.hideLoading();
        });
      })
      .catch((err) => {
        this.toast.showToast('Erro ao preparar busca, Profissiões não encontradas! ');
      });
  }

  /**
   * @description request all states from IBGE Api.
   */
  public getStates() {
    this.locations.getStates()
      .then((res) => {
        this.states = res;
      })
      .catch(() => {
        this.toast.showToast('Estado não encontrado! ');
      });
  }

  /**
   * @description change filter type view.
   */
  public changeSearchMode() {
    this.stateSelected = Constants.DEFAULT_VALUE_FOR_STATE_SEARCH;
    this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
    this.jobSelected = Constants.DEFAULT_VALUE_FOR_JOB_SEARCH;
    this.rateSelected = Constants.DEFAULT_VALUE_FOR_RATE_SEARCH;

    this.hasStateSelected = false;
    this.stateId = 0;

    this.filterOptions = new FilterOptions();
    this.searchMode === Constants.SEARCH_BASIC ? this.searchMode = Constants.SEARCH_COMPLETE : this.searchMode = Constants.SEARCH_BASIC;
  }

  /**
   * @description finish a filter options object.
   */
  public createFilter() {
    if (this.filterOptions.profileCity === undefined) {
      this.filterOptions.profileCity = AppConfig.USER_PROFILE.city;
    }

    if (this.filterOptions.profileState === undefined) {
      this.filterOptions.profileState = AppConfig.USER_PROFILE.state;
    }

    if (this.filterOptions.profileRate === undefined) {
      this.filterOptions.profileRate = 0;
    }

    if (this.filterOptions.profileName === undefined) {
      this.filterOptions.profileName = '';
    }

    if (this.filterOptions.profileJob === undefined) {
      this.filterOptions.profileJob = '';
    }

    this.requestProfiles();
  }

  /**
   * @description request profiles based on user filters.
   */
  public requestProfiles() {
    this.profileProvider.getProfiles(this.filterOptions, this.itemsForPage)
      .then((res) => {
        res.subscribe((values) => {
          this.results(values);
        });
      })
      .catch(() => {
        this.searchMode = Constants.SEARCH_BASIC;
        this.toast.showToast(`Ops, erro ao buscar profissionais!`);
      });
  }

  /**
   * @description parsed and recover all profiles from requisitions.
   * @param values profile list.
   */
  public results(values: any) {
    this.profiles = new Array<Profile>();
    let profileFiltered = new Array<Profile>();
    if (this.profileName !== undefined && this.profileName !== '' && this.profileName != null) {
      profileFiltered = values.filter((profile: Profile) => {
        return (profile.name.firstName.toLowerCase().indexOf(this.profileName.toLowerCase()) > -1);
      });
    } else {
      profileFiltered = values;
    }
    this.buildList(profileFiltered);
    if (this.profiles.length > 0) {
      this.pageTiitle = 'Resultado da busca';
      this.searchMode = Constants.SEARCH_DISABLED;
    } else {
      this.toast.showToast(`Ops, não encontramos profissionais para essa busca!`);
    }
  }

  /**
   * @description build a profile list based on user filtes.
   * @param values profile list.
   */
  public buildList(values) {
    if (values.length > 0) {
      values.forEach((element: Profile) => {
        if (element.uid !== AppConfig.USER_PROFILE.uid) {
          this.profiles.push(element);
        }
      });
      this.itemsOnPage = this.profiles.length;
    }
  }

  /**
   * @description improve the profiles request limit when user scroll screen.
   * @param infiniteScroll event.
   */
  public doInfinite(infiniteScroll) {
    this.itemsForPage += 10;
    this.requestProfiles();
  }

  /**
   * @description Build user avatar image on a view list.
   * @param imagePath profile image path.
   */
  public setAvatarImage(imagePath: string) {
    let profilePhoto = '';
    if (imagePath) {
      profilePhoto = imagePath;
    } else {
      profilePhoto = '../../../assets/imgs/149071.png';
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    return this.starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    return this.starsRateHelper.starsRateColor(value);
  }

  /**
   * @description show search fields and hide search results.
   */
  public searchAgain() {
    this.pageTiitle = 'Busca por profissionais';
    this.searchMode = Constants.SEARCH_BASIC;
    this.itemsForPage = 10;
    this.itemsOnPage = 0;
  }

  /**
   * @description redirect user to a select job modal.
   */
  public selectJob() {
    this.onJobSelected();
    this.navCtrl.push('JobSearchPage', { jobList: this.sectors });
  }

  /**
   * @description redirect user to a select rate modal.
   */
  public selectRate() {
    this.onRateSelected();
    this.navCtrl.push('RatingSearchPage');
  }

  /**
   * @description redirect user to a select state modal.
   */
  public selectState() {
    this.onStateSelected();
    this.navCtrl.push('StateSearchPage', { stateList: this.states });
  }

  /**
   * @description redirect user to a select city modal.
   */
  public selectCity() {
    this.onCitySelected();
    this.navCtrl.push('CitySearchPage', { stateId: this.stateId });
  }

  /**
   * @description redirect user to a selected profile detail.
   */
  public goToDetails(profile: any) {
    this.navCtrl.push('ProfileDetailsPage', { profile });
  }

  /**
   * @description event when user select a rate on rate modal.
   */
  private onRateSelected() {
    this.events.subscribe('rateSelected', async (rate: number) => {
      if (rate !== undefined) {
        this.filterOptions.profileRate = rate;
        this.rateSelected = rate + ' estrelas';
      } else {
        this.filterOptions.profileRate = undefined;
        this.rateSelected = Constants.DEFAULT_VALUE_FOR_RATE_SEARCH;
      }
      this.events.unsubscribe('rateSelected');
    });
  }

  /**
   * @description event when user select a city on city modal.
   */
  private onCitySelected() {
    this.events.subscribe('citySelected', async (city: string) => {
      if (city !== undefined) {
        this.filterOptions.profileCity = city;
        this.citySelected = city;
      } else {
        this.filterOptions.profileCity = undefined;
        this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
      }
      this.events.unsubscribe('citySelected');
    });
  }

  /**
   * @description event when user select a state on state modal.
   */
  private onStateSelected() {
    this.events.subscribe('stateSelected', async (state: any) => {
      if (state !== undefined) {
        this.filterOptions.profileState = state.sigla;
        this.stateSelected = state.sigla;
        this.hasStateSelected = true;
        this.stateId = state.id;
      } else {
        this.hasStateSelected = false;
        this.filterOptions.profileState = undefined;
        this.filterOptions.profileCity = undefined;
        this.stateSelected = Constants.DEFAULT_VALUE_FOR_STATE_SEARCH;
        this.citySelected = Constants.DEFAULT_VALUE_FOR_CITY_SEARCH;
      }
      this.events.unsubscribe('stateSelected');
    });
  }

  /**
   * @description event when user select a job on job modal.
   */
  private onJobSelected() {
    this.events.subscribe('jobSelected', async (job: string) => {
      if (job !== undefined) {
        this.filterOptions.profileJob = job;
        this.jobSelected = job;
      } else {
        this.filterOptions.profileJob = undefined;
        this.jobSelected = Constants.DEFAULT_VALUE_FOR_JOB_SEARCH;
      }
      this.events.unsubscribe('jobSelected');
    });
  }
}
