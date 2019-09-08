import { Profile } from './../../../model/profile/profile';
import { Constants } from './../../../util/constants/constants';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Alert } from './../../../util/alert/alert';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from '../../../model/static/static';
import { AuthProvider } from '../../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-app-config',
  templateUrl: 'app-config.html',
})
export class AppConfigPage {
  @ViewChild('refresherRef') refresherRef;

  private profile: Profile = { ...AppConfig.USER_PROFILE };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public authProvider: AuthProvider,
    public alert: Alert,
    public toast: Toast,
    public loading: Loading) {
  }

  updateProfileExbition() {
    var oldOption = this.profile.hideMyProfile;
    this.profile.hideMyProfile = !this.profile.hideMyProfile;

    this.loading.showLoading("Atualizando perfil...")
      .then(async () => {
        return this.profileProvider.saveProfile(this.profile)
          .then(async () => {
            return this.loading.hideLoadingPromise()
              .then(() => {
                this.toast.showToast("Perfil atualizado!");
              })
          })
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
    this.authProvider.resetPassword(this.profile.email)
      .then(() => {
        this.alert.simpleAlert(
          "Nova senha",
          "Pedido de alteração de senha com sucesso! Verifique o seu e-mail."
        )
      })
      .catch(() => {
        this.toast.showToast("Erro ao pedir alteração de senha!");
      })
  }

  disableAccount() {
    this.alert.confirmAlert('Excluir conta',
      'Deseja excluir a sua conta? Não será possivel recuperar a conta novamente.',
      () => {
        this.confirmDisableAccount()
      }, null)
  }

  confirmDisableAccount() {

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.refresherRef.complete();
    }, 2000);
  }
}
