import { Component } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { AppConfig } from '../../../model/static/static';
import { ExternalAppProvider } from '../../../providers/external-app/external-app';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { Profile } from './../../../model/profile/profile';

@IonicPage()
@Component({
  selector: 'page-send-solicitation',
  templateUrl: 'send-solicitation.html',
})
export class SendSolicitationPage {

  public contractorPf: Profile;
  public hiredPf: Profile;
  public solicitationDone: boolean = false;
  public solicitation: Solicitation;
  public solicitationDate = '';
  public solicitationName = '';
  public solicitationDescription = '';
  public enableDescription: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public toast: Toast,
    public extApp: ExternalAppProvider,
    public solicitationProvider: SolicitationProvider) { }

  /**
   * @description on page will enter.
   */
  public ionViewWillEnter() {
    this.getProfileToService();
  }

  /**
   * @description recover profiles received as params.
   */
  public getProfileToService() {
    this.contractorPf = { ...AppConfig.USER_PROFILE };
    this.hiredPf = this.navParams.get(Constants.SOLICITATION_PROFILE);
  }

  /**
   * @description Build user avatar image.
   * @param imagePath profile image path.
   */
  public setAvatarImage(imagePath: string) {
    let profilePhoto = '';
    if (imagePath) {
      profilePhoto = imagePath;
    } else {
      profilePhoto = '../../../assets/imgs/user_default_image.png';
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  /**
   * @description send solicitation for user and save it on database.
   */
  public makeService() {
    if (this.formValidation()) {
      this.enableDescription = false;
      this.solicitationUser();
    }
  }

  /**
   * @description build solicitation object.
   */
  public solicitationUser() {
    const solicitation: Solicitation = {
      uId: UUID.UUID(),
      solicitationId: UUID.UUID(),
      contractorUid: this.contractorPf.uid,
      hiredUid: this.hiredPf.uid,
      lastActionByUserUid: this.contractorPf.uid,
      description: this.solicitationDescription,
      observations: null,
      date: parseInt(Date.now().toString(), 0),
      status: Constants.SOLICITATION_IS_OPEN,
      name: '',
      profileNames: {
        contractorName: this.contractorPf.name.firstName + ' ' + this.contractorPf.name.lastName,
        hiredName: this.hiredPf.name.firstName + ' ' + this.hiredPf.name.lastName,
      },
      removedTo: {
        contractorUid: null,
        hiredUid: null,
      },
      avaliatedTo: {
        contractorAvaliation: null,
        hiredAvaliation: null,
      },
    };

    this.saveSolicitation(solicitation);
  }

  /**
   * @description enable solicitation description on view.
   */
  public setServiceDescription() {
    this.enableDescription = true;
  }

  /**
   * @description redirec user to his profile.
   */
  public backToMyProfile() {
    this.navCtrl.setRoot('ProfilePage');
  }

  /**
   * @description validade send solicitations form.
   */
  public formValidation() {
    if (!this.solicitationDescription) {
      this.toast.showToast('Preencha a descrição desta solicitação!');
      return false;
    }

    return true;
  }

  /**
   * @description Open a specific application to make contact with other user.
   * @param app Application name to be open.
   */
  public goToApp(app: string) {
    switch (app) {
      case 'whats':
        this.extApp.openWhatsApp(this.hiredPf.social.whatsapp);
        break;
      case 'face':
        this.extApp.openFacebook(this.hiredPf.social.facebook);
        break;
      case 'inst':
        this.extApp.openPhoneApp(this.hiredPf.social.instagram);
        break;
      case 'phone':
        const phone = this.hiredPf.phone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
        this.extApp.openPhoneApp(phone);
        break;
      case 'email':
        this.extApp.openMailApp(this.hiredPf.email);
        break;
      default:
        break;
    }
  }

  /**
   * @description save solicitation on database.
   * @param solicitation solicitation to be saved on database.
   */
  private saveSolicitation(solicitation: Solicitation) {
    this.loading.showLoading('Solicitando serviço...')
      .then(() => {
        this.solicitationProvider.createSolicitation(solicitation)
          .then(async () => {
            this.onSuccess(solicitation);
          })
          .catch((err) => {
            this.onError();
          });
      });
  }

  /**
   * @description show error messages to user.
   */
  private onError() {
    this.solicitationDone = false;
    this.loading.hideLoading();
    this.toast.showToast('Erro ao solicitar serviço!');
  }

  /**
   * @description show a summary from a new solicitation successfull saved on database.
   * @param solicitation solicitation saved on database.
   */
  private onSuccess(solicitation: Solicitation) {
    this.solicitation = solicitation;
    this.solicitationDate = new Date(this.solicitation.date).toLocaleDateString();
    this.loading.hideLoading();
    this.solicitationDone = true;
    this.toast.showToast('Solicitação enviada com sucesso!');
  }
}
