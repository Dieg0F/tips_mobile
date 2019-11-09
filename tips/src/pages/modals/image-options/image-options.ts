import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, normalizeURL, ViewController } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { DataProvider } from '../../../providers/data/data';
import { ProfileProvider } from '../../../providers/profile/profile';
import { CameraProvider } from '../../../util/camera/camera';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

const CAMERA_SOURCE = 'CAMERA_SOURCE';
const GALLERY_SOURCE = 'GALLERY_SOURCE';

@IonicPage()
@Component({
  selector: 'page-image-options',
  templateUrl: 'image-options.html',
})
export class ImageOptionsPage {

  public isVisitor: boolean = false;
  public profile = { ...AppConfig.USER_PROFILE };

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public dataProvider: DataProvider,
    public profileProvider: ProfileProvider,
    public loading: Loading,
    public toast: Toast,
    public camera: CameraProvider) {
  }

  public ionViewWillEnter() {
    this.isVisitor = this.navParams.get('isVisitor');
  }

  /**
   * @description Build user avatar image.
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
   * @description close this modal and emit empty city event.
   */
  public close() {
    this.viewCtrl.dismiss();
  }

  /**
   * @description GEt a image from gallery.
   */
  public getImageOnGallery() {
    this.loading.showLoading('Salvando imagem...')
      .then(() => {
        this.camera.getPicture(GALLERY_SOURCE)
          .then((img) => {
            return this.savingImage(img);
          })
          .catch((error) => {
            this.loading.hideLoading();
          });
      });
  }

  /**
   * @description Get a image from camera.
   */
  public takeAPhoto() {
    this.loading.showLoading('Salvando imagem...')
      .then(() => {
        this.camera.getPicture(CAMERA_SOURCE)
          .then((img) => {
            return this.savingImage(img);
          })
          .catch((error) => {
            this.loading.hideLoading();
          });
      });
  }

  /**
   * @description Save a image on Firebase Storage.
   * @param img Image to be saved.
   */
  private async savingImage(img: any) {
    const fileUrl = normalizeURL('data:image/jpeg;base64,' + img);
    const oldFile = this.profile.profilePhotoUrl;
    this.profile.profilePhotoUrl = fileUrl;
    const selectedPhoto: any = this.dataURItoBlob(fileUrl);
    await this.dataProvider.uploadPhoto(AppConfig.PROFILE_PHOTO_PATH, selectedPhoto, this.profile.uid)
      .then(async (res) => {
        this.profile.profilePhotoUrl = res;
        return this.profileProvider.saveProfile(this.profile)
          .then(async () => {
            AppConfig.USER_PROFILE = this.profile;
            this.loading.hideLoading();
            this.toast.showToast('Foto de perfil salva com sucesso!');
          })
          .catch(() => {
            this.profile.profilePhotoUrl = oldFile;
            this.loading.hideLoading();
            this.toast.showToast('Erro ao salvar foto de perfil!');
          });
      })
      .catch((err) => {
        this.profile.profilePhotoUrl = oldFile;
        this.toast.showToast('Erro ao carregar imagem.');
        this.loading.hideLoading();
      });
  }

}
