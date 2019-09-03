import { Profile } from './../../../model/profile/profile';
import { Constants } from './../../../util/constants/constants';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Alert } from './../../../util/alert/alert';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-app-config',
  templateUrl: 'app-config.html',
})
export class AppConfigPage {

  private profile: Profile = { ...AppConfig.USER_PROFILE };
  public hideMyContacts: boolean = false;
  public hideMyContactsOption = "";

  public hideMyProfile: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public alert: Alert,
    public toast: Toast,
    public loading: Loading) {
  }

  ionViewDidLoad() {
    //Update hideMyContacts value and hideMyContactsOption type!
    this.hideMyContactsOption = "Esconder meus contatos!"

    this.profile.hideMyProfile = true;
  }

  updateProfileContactsStatus() {
    //Contact Profile Status will be a new feature on app.
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    console.log(this.hideMyContactsOption)
  }

  updateProfileExbition() {
    //Contact Profile Status will be a new feature on app.
    //UPDATE DATABASE, MODELS AND USERS FOR THIS    
    console.log(this.profile.hideMyProfile);
    var oldOption = this.profile.hideMyProfile;
    this.profile.hideMyProfile = !this.profile.hideMyProfile;

    console.log(this.profile.hideMyProfile);

    this.profileProvider.saveProfile(this.profile)
      .then((res) => {
        console.log(res.data());
      })
      .catch((err) => {
        this.profile.hideMyProfile = oldOption;
        console.log(err)
      })
  }

  updateAccountType() {
    //Account Condition, based on account Type
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    var message = ""
    if (message) {
      message = "Deseja alterar o tipo de sua conta para profissional?"
    } else {
      message = "Deseja alterar o tipo de sua conta para usuário simples?"
    }

    this.alert.confirmAlert('Alterar tipo de conta',
      message,
      () => {
        this.confirmAccountType()
      }, null)
  }

  confirmAccountType() {
    console.log('Update Account Type!!')
  }

  updatePassword() {
    this.alert.confirmAlert('Alteração senha',
      'Deseja alterar a sua senha de acesso?',
      () => {
        this.confirmUpdatePassoword()
      }, null)
  }

  confirmUpdatePassoword() {
    console.log('Update Password!!')
  }

  disableAccount() {
    this.alert.confirmAlert('Excluir conta',
      'Deseja excluir a sua conta? Não será possivel recuperar a conta novamente.',
      () => {
        this.confirmDisableAccount()
      }, null)
  }

  confirmDisableAccount() {
    console.log('Disable Account!!')
  }
}
