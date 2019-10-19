import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { Sector } from '../../../model/sector/sector';
import { AppConfig } from '../../../model/static/static';
import { DataProvider } from '../../../providers/data/data';
import { ProfileProvider } from '../../../providers/profile/profile';
import { SectorProvider } from '../../../providers/sector/sector';
import { StorageProvider } from '../../../providers/storage/storage';
import { UserProvider } from '../../../providers/user/user';
import { CameraProvider } from '../../../util/camera/camera';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  public profile = { ...AppConfig.USER_PROFILE };
  public sectors: Sector[] = [];
  public stateId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public profileProvider: ProfileProvider,
    public storageProvider: StorageProvider,
    public loading: Loading,
    public dataProvider: DataProvider,
    public sectorsProvider: SectorProvider,
    public toast: Toast,
    public events: Events,
    public camera: CameraProvider) {
  }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getJobs();
  }

  /**
   * @description Build user avatar image on a view list.
   */
  public setAvatarImage() {
    let profilePhoto = '';
    if (this.profile.profilePhotoUrl) {
      profilePhoto = this.profile.profilePhotoUrl;
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
   * @description request all jobs from database.
   */
  public getJobs() {
    this.loading.showLoading('Carregando...');
    this.sectors = new Array<Sector>();
    this.sectorsProvider.getSectors()
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
   * @description cancel profile configuration.
   */
  public skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
  }

  /**
   * @description update profile photo on database.
   */
  public setProfilePhoto() {
    this.loading.showLoading('Salvando imagem...')
      .then(() => {
        this.camera.getPicture()
          .then((img) => {
            const fileUrl = normalizeURL('data:image/jpeg;base64,' + img);
            const selectedPhoto: any = this.dataURItoBlob(fileUrl);
            return this.dataProvider.uploadPhoto(AppConfig.PROFILE_PHOTO_PATH, selectedPhoto, this.profile.uid)
              .then((downloadURL) => {
                this.profile.profilePhotoUrl = downloadURL;
                const elm = document.getElementById('set_profileImage');
                elm.style.backgroundImage = 'url(\'' + downloadURL + '\')';
                elm.style.backgroundSize = 'cover';
                this.loading.hideLoading();
              });
          })
          .catch((error) => {
            this.loading.hideLoading();
          });
      });
  }

  /**
   * @description convert a URI file to blob
   * @param dataURI URI file.
   */
  public dataURItoBlob(dataURI: string) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  /**
   * @description update profile on database.
   */
  public save() {
    if (this.formValidation()) {
      this.loading.showLoading('Salvando perfil...')
        .then(() => {
          this.profileProvider.saveProfile({ ...this.profile })
            .then(() => {
              this.loading.hideLoading();
              this.toast.showToast('Perfil salvo com sucesso!');
              this.skipProfile();
              AppConfig.USER_PROFILE = this.profile;
            })
            .catch(() => {
              this.loading.hideLoading();
              this.toast.showToast('Erro ao salvar o perfil!');
            });
        });
    }
  }

  /**
   * @description redirect user to a select job modal.
   */
  public selectJob() {
    this.onJobSelected();
    this.navCtrl.push('JobSearchPage', { jobList: this.sectors });
  }

  /**
   * @description redirect user to a select state modal.
   */
  public selectState() {
    this.onStateSelected();
    this.navCtrl.push('StateSearchPage');
  }

  /**
   * @description redirect user to a select city modal.
   */
  public selectCity() {
    if (this.profile.state) {
      this.onCitySelected();
      this.navCtrl.push('CitySearchPage', { stateId: this.stateId });
    } else {
      this.toast.showToast('Selecione o estado primeiro!');
    }
  }

  /**
   * @description validate if user has complete all fields.
   */
  public formValidation(): boolean {
    if (!this.profile.name.firstName) {
      this.toast.showToast('Insira seu primeiro nome!');
      return false;
    }
    if (!this.profile.name.lastName) {
      this.toast.showToast('Insira seu ultimo nome!');
      return false;
    }
    if (!this.profile.cpf) {
      this.toast.showToast('Insira seu CPF!');
      return false;
    }
    if (!this.profile.phone) {
      this.toast.showToast('Insira seu número de telefone!');
      return false;
    }
    if (!this.profile.street) {
      this.toast.showToast('Insira o nome da rua em que mora!');
      return false;
    }
    if (!this.profile.houseNumber) {
      this.toast.showToast('Insira o numero da sua casa!');
      return false;
    }
    if (!this.profile.district) {
      this.toast.showToast('Insira o nome do seu bairro!');
      return false;
    }
    if (!this.profile.state) {
      this.toast.showToast('Selecione o estado de sua cidade!');
      return false;
    }
    if (!this.profile.city) {
      this.toast.showToast('Selecione a cidade onde mora!');
      return false;
    }
    if (this.profile.isAPro) {
      if (!this.profile.job) {
        this.toast.showToast('Selecione a profissão em que trabalha!');
        return false;
      }
      if (!this.profile.aboutMe) {
        this.toast.showToast('Escreva um pouco sobre você!');
        return false;
      }
    }
    return true;
  }

  /**
   * @description event when user select a city on city modal.
   */
  private onCitySelected() {
    this.events.subscribe('citySelected', async (city: string) => {
      if (city !== undefined) {
        this.profile.city = city;
      } else {
        this.profile.city = '';
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
        this.profile.state = state.sigla;
        this.stateId = state.id;
      } else {
        this.profile.state = '';
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
        this.profile.job = job;
      } else {
        this.profile.job = '';
      }
      this.events.unsubscribe('jobSelected');
    });
  }
}
