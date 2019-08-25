import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { UserProvider } from '../../../providers/user/user';
import { AppConfig } from '../../../model/static/static';
import { CameraProvider } from '../../../util/camera/camera';
import { StorageProvider } from '../../../providers/storage/storage';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { DataProvider } from '../../../providers/data/data';

@IonicPage()
@Component({
  selector: 'page-profile-configuration',
  templateUrl: 'profile-configuration.html',
})
export class ProfileConfigurationPage {

  @ViewChild(Slides) slides: Slides;

  public profile = { ...AppConfig.USER_PROFILE }
  public slideIndex: number = 0

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

  ionViewWillEnter() {
    var elm = document.getElementById('set_profileImage');
    elm.style.backgroundImage = "url('" + this.profile.profilePhotoUrl + "')";
    elm.style.backgroundSize = "cover";
    this.slideIndex = 0
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
  }

  setProfilePhoto() {
    this.loading.showLoading("Salvando imagem...")
    console.log("setProfilePhoto >> Get Profile Photo and Save on Database");
    this.camera.getPicture()
      .then(async (img) => {
        var fileUrl = normalizeURL('data:image/jpeg;base64,' + img)
        let selectedPhoto: any = this.dataURItoBlob(fileUrl);
        return this.dataProvider.uploadPhoto(AppConfig.PROFILE_PHOTO_PATH, selectedPhoto, this.profile.uid)
          .then((downloadURL) => {
            this.profile.profilePhotoUrl = downloadURL
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

  slideNext() {
    this.slides.lockSwipes(false);
    this.slides.slideNext()
    // if (this.slides.getActiveIndex() != 0) {

    // } else if (this.slides.getActiveIndex() == 0 && this.profile.isCompany) {
    //   this.slides.slideNext()
    // } else if (!this.profile.isCompany) {
    //   this.slides.slideTo(2)
    // }
    this.slides.lockSwipes(true);
    this.slideIndex = this.slides.getActiveIndex()
  }

  slidePrev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev()
    // if (this.slides.getActiveIndex() != 2) {
    //   this.slides.slidePrev()
    // } else if (this.slides.getActiveIndex() == 2 && this.profile.isCompany) {
    //   this.slides.slidePrev()
    // } else if (!this.profile.isCompany) {
    //   this.slides.slideTo(0)
    // }
    this.slides.lockSwipes(true);
    this.slideIndex = this.slides.getActiveIndex()
  }
}
