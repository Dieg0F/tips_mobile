import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, normalizeURL} from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { UserProvider } from '../../../providers/user/user';
import { AppConfig } from '../../../model/static/static';
import { CameraProvider } from '../../../util/camera/camera';
import { StorageProvider } from '../../../providers/storage/storage';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-company-profile',
  templateUrl: 'company-profile.html',
})
export class CompanyProfilePage implements OnInit {

  @ViewChild(Slides) slides: Slides;

  public profile = AppConfig.USER_PROFILE

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public profileProvider: ProfileProvider,
    public storageProvider: StorageProvider,
    public loading: Loading,
    public toast: Toast,
    public camera: CameraProvider) { }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  skipProfile() {
    this.navCtrl.setRoot('ProfilePage');
    this.navCtrl.goToRoot;
  }

  setProfilePhoto() {
    console.log("setProfilePhoto >> Get Profile Photo and Save on Database");
    this.camera.getPicture()
    .then((img) => {
      var elm = document.getElementById('img_profile');
      var fileUrl = normalizeURL('data:image/jpeg;base64,' + img)
      elm.style.backgroundImage = "url(" + fileUrl + ")";
      elm.style.backgroundSize = "cover";  
    })
    .catch((error) => {
      console.log("setProfilePhoto >> Error: ", error)
    })
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
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slidePrev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }  

  ngOnInit() {
    var elm = document.getElementById('img_profile');
    elm.style.backgroundImage = "url('" + AppConfig.USER_FILES.profilePhoto + "')";
    elm.style.backgroundSize = "cover";  
  }
}

