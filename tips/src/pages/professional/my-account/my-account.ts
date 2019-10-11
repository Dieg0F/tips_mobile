import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL, Events } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StorageProvider } from '../../../providers/storage/storage';
import { Toast } from '../../../util/toast/toast';
import { CameraProvider } from '../../../util/camera/camera';
import { DataProvider } from '../../../providers/data/data';
import { Loading } from '../../../util/loading/loading';
import { AppConfig } from '../../../model/static/static';
import { SectorProvider } from '../../../providers/sector/sector';
import { Sector } from '../../../model/sector/sector';

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  public profile = { ...AppConfig.USER_PROFILE }
  public sectors: Array<Sector> = [];
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

  ionViewWillEnter() {
    this.getSectors();
  }

  getSectors() {
    this.loading.showLoading("Carregando...")
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

  skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
  }

  setProfilePhoto() {
    this.loading.showLoading("Salvando imagem...")
      .then(() => {
        console.log("setProfilePhoto >> Get Profile Photo and Save on Database");
        this.camera.getPicture()
          .then((img) => {
            var fileUrl = normalizeURL('data:image/jpeg;base64,' + img)
            let selectedPhoto: any = this.dataURItoBlob(fileUrl);
            return this.dataProvider.uploadPhoto(AppConfig.PROFILE_PHOTO_PATH, selectedPhoto, this.profile.uid)
              .then((downloadURL) => {
                this.profile.profilePhotoUrl = downloadURL;
                var elm = document.getElementById('set_profileImage');
                elm.style.backgroundImage = "url('" + downloadURL + "')";
                elm.style.backgroundSize = "cover";
                this.loading.hideLoading()
              })
          })
          .catch((error) => {
            console.log("setProfilePhoto >> Error: ", error)
            this.loading.hideLoading()
          })
      })
  }

  dataURItoBlob(dataURI: string) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  save() {
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
            })
        })
    }
  }

  selectJob() {
    this.onJobSelected();
    this.navCtrl.push("JobSearchPage", { 'jobList': this.sectors });
  }

  selectState() {
    this.onStateSelected();
    this.navCtrl.push("StateSearchPage");
  }

  selectCity() {
    if (this.profile.state) {
      this.onCitySelected();
      this.navCtrl.push("CitySearchPage", { 'stateId': this.stateId });
    } else {
      this.toast.showToast("Selecione o estado primeiro!");
    }
  }

  private onCitySelected() {
    this.events.subscribe('citySelected', async (city: string) => {
      if (city != undefined) {
        this.profile.city = city;
      }
      else {
        this.profile.city = "";
      }
      this.events.unsubscribe('citySelected');
    });
  }

  private onStateSelected() {
    this.events.subscribe('stateSelected', async (state: any) => {
      if (state != undefined) {
        this.profile.state = state.sigla
        this.stateId = state.id
      }
      else {
        this.profile.state = "";
      }
      this.events.unsubscribe('stateSelected');
    });
  }

  private onJobSelected() {
    this.events.subscribe('jobSelected', async (job: string) => {
      if (job != undefined) {
        this.profile.job = job
      }
      else {
        this.profile.job = "";
      }
      this.events.unsubscribe('jobSelected');
    });
  }


  formValidation(): boolean {
    if (!this.profile.name.firstName) {
      this.toast.showToast("Insira seu primeiro nome!");
      return false;
    }
    if (!this.profile.name.lastName) {
      this.toast.showToast("Insira seu ultimo nome!");
      return false;
    }
    if (!this.profile.cpf) {
      this.toast.showToast("Insira seu CPF!");
      return false;
    }
    if (!this.profile.phone) {
      this.toast.showToast("Insira seu número de telefone!");
      return false;
    }
    if (!this.profile.street) {
      this.toast.showToast("Insira o nome da rua em que mora!");
      return false;
    }
    if (!this.profile.houseNumber) {
      this.toast.showToast("Insira o numero da sua casa!");
      return false;
    }
    if (!this.profile.district) {
      this.toast.showToast("Insira o nome do seu bairro!");
      return false;
    }
    if (!this.profile.state) {
      this.toast.showToast("Selecione o estado de sua cidade!");
      return false;
    }
    if (!this.profile.city) {
      this.toast.showToast("Selecione a cidade onde mora!");
      return false;
    }
    if (this.profile.isAPro) {
      if (!this.profile.job) {
        this.toast.showToast("Selecione a profissão em que trabalha!");
        return false;
      }
      if (!this.profile.aboutMe) {
        this.toast.showToast("Escreva um pouco sobre você!");
        return false;
      }
    }
    return true;
  }
}
