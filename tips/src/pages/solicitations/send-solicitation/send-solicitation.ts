import { Profile } from './../../../model/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Solicitation } from '../../../model/solicitation/solicitation';
import { SolicitationProvider } from '../../../providers/solicitations/solicitations';
import { Toast } from '../../../util/toast/toast';

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

  public solicitationDate = "";
  public solicitationName = "";
  public solicitationDescription = "";

  public enableDescription: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public toast: Toast,
    public solicitationProvider: SolicitationProvider) { }

  ionViewWillEnter() {
    this.getProfileToService()
  }

  getProfileToService() {
    this.contractorPf = { ...AppConfig.USER_PROFILE }
    this.hiredPf = this.navParams.get(Constants.SOLICITATION_PROFILE)
  }

  setAvatarImage(imagePath: string) {
    var profilePhoto = "";
    if (imagePath) {
      profilePhoto = imagePath;
    } else {
      profilePhoto = "../../../assets/imgs/149071.png";
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-size': 'cover',
      'background-position': 'center'
    };
  }

  makeService() {
    if (this.formValidation()) {
      this.enableDescription = false;
      this.solicitationUser();
    }
  }

  solicitationUser() {
    let solicitation: Solicitation = {
      uId: UUID.UUID(),
      solicitationId: UUID.UUID(),
      contractorUid: this.contractorPf.uid,
      hiredUid: this.hiredPf.uid,
      lastActionByUserUid: this.contractorPf.uid,
      description: this.solicitationDescription,
      observations: null,
      date: parseInt(Date.now().toString()),
      status: Constants.SOLICITATION_IS_OPEN,
      name: "",
      profileNames: {
        contractorName: this.contractorPf.name.firstName + " " + this.contractorPf.name.lastName,
        hiredName: this.hiredPf.name.firstName + " " + this.hiredPf.name.lastName,
      },
      removedTo: {
        contractorUid: null,
        hiredUid: null,
      },
      avaliatedTo: {
        contractorAvaliation: null,
        hiredAvaliation: null,
      }
    }

    this.saveSolicitation(solicitation);
  }

  private saveSolicitation(solicitation: Solicitation) {
    this.loading.showLoading("Solicitando serviço...")
      .then(() => {
        this.solicitationProvider.createSolicitation(solicitation)
          .then(async () => {
            this.onSuccess(solicitation);
          })
          .catch((err) => {
            console.log(err);
            this.onError();
          });
      })
      .catch(() => {
        console.log("Error: NewServicePage, Loading")
      })
  }

  private onError() {
    this.solicitationDone = false;
    this.loading.hideLoading();
    this.toast.showToast("Erro ao solicitar serviço!");
  }

  private onSuccess(solicitation: Solicitation) {
    this.solicitation = solicitation;
    this.solicitationDate = new Date(this.solicitation.date).toLocaleDateString();
    this.loading.hideLoading();
    this.solicitationDone = true;
    this.toast.showToast("Solicitação enviada com sucesso!");
  }

  setServiceDescription() {
    this.enableDescription = true;
  }

  backToMyProfile() {
    this.navCtrl.setRoot("ProfilePage");
  }

  formValidation() {
    if (!this.solicitationDescription) {
      this.toast.showToast("Preencha a descrição desta solicitação!");
      return false;
    }

    return true;
  }
}
