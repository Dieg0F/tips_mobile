import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { ProfileProvider } from '../../../providers/profile/profile';
import { StorageProvider } from '../../../providers/storage/storage';
import { Toast } from '../../../util/toast/toast';
import { CameraProvider } from '../../../util/camera/camera';
import { DataProvider } from '../../../providers/data/data';
import { Loading } from '../../../util/loading/loading';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html',
})
export class MyAccountPage {

  public profile = AppConfig.USER_PROFILE
  private selectedPhoto: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public profileProvider: ProfileProvider,
    public storageProvider: StorageProvider,
    public loading: Loading,
    public dataProvider: DataProvider,
    public toast: Toast,
    public camera: CameraProvider) { }

  ngOnInit() {
    var elm = document.getElementById('set_profileImage');
    elm.style.backgroundImage = "url('" + AppConfig.USER_FILES.profilePhoto + "')";
    elm.style.backgroundSize = "cover";
  }

  skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
  }

  setProfilePhoto() {
    this.loading.showLoading("Salvando imagem...")
    console.log("setProfilePhoto >> Get Profile Photo and Save on Database");
    this.camera.getPicture()
      .then((img) => {
        var fileUrl = normalizeURL('data:image/jpeg;base64,' + img)
        this.selectedPhoto = this.dataURItoBlob(fileUrl);
        return this.dataProvider.uploadPhoto(AppConfig.PROFILE_PHOTO_PATH, this.selectedPhoto)
          .then((downloadURL) => {
            AppConfig.USER_FILES.profilePhoto = downloadURL
            return this.storageProvider.setItem('userProfilePhotoUrl', downloadURL)
              .then(() => {
                var elm = document.getElementById('set_profileImage');
                elm.style.backgroundImage = "url(" + fileUrl + ")";
                elm.style.backgroundSize = "cover";
                this.loading.hideLoading()
              })
          })
      })
      .catch((error) => {
        console.log("setProfilePhoto >> Error: ", error)
        this.loading.hideLoading()
      })
  }

  dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  save() {
    this.loading.showLoading('Salvando perfil...')
    console.log("Slide Finished");
    this.profileProvider.saveProfile({ ...this.profile })
      .then(() => {
        this.loading.hideLoading();
        this.toast.showToast('Perfil salvo com sucesso!');
        this.skipProfile();
      })
      .catch(() => {
        this.loading.hideLoading();
        this.toast.showToast('Erro ao salvar o perfil!');
      })
  }

}