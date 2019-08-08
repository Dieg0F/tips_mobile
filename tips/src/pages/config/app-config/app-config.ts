import { Constants } from './../../../util/constants/constants';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Alert } from './../../../util/alert/alert';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { bind } from '@angular/core/src/render3/instructions';

@IonicPage()
@Component({
  selector: 'page-app-config',
  templateUrl: 'app-config.html',
})
export class AppConfigPage {

  private profile: any;
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
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE);
    //Update hideMyContacts value and hideMyContactsOption type!
    this.hideMyContactsOption = "Esconder meus contatos!"
  }

  updateProfileContactsStatus() {
    //Contact Profile Status will be a new feature on app.
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    console.log(this.hideMyContactsOption)
  }

  updateProfileExbition() {
    //Contact Profile Status will be a new feature on app.
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    console.log(this.hideMyProfile)
  }

  updateAccountType() {
    //Account Condition, based on account Type
    //UPDATE DATABASE, MODELS AND USERS FOR THIS
    var message = ""
    if (true) {
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
