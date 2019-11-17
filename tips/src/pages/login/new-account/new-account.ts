import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { StorageProvider } from '../../../providers/storage/storage';
import { UserProvider } from '../../../providers/user/user';
import { Alert } from '../../../util/alert/alert';
import { Constants } from '../../../util/constants/constants';
import { Loading } from '../../../util/loading/loading';
import { Regex } from '../../../util/regex/regex';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {

  public isAPro: boolean = true;
  private regex: Regex;

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public storage: StorageProvider,
    public loading: Loading,
    public alert: Alert,
    public toast: Toast) { }

  /**
   * @description create a new accoutn for new user.
   * @param form view form with all user data values.
   */
  public newAccount(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Estamos criando a sua conta...')
        .then(() => {
          this.authProvider.createNewAccount(form.value.email, form.value.password)
            .then((result) => {
              const newUser = {
                uid: result.user.uid,
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                isAPro: form.value.isAPro,
                accountType: 'APPLICATION',
              };
              return this.saveUser(newUser);
            })
            .catch((error) => {
              this.onError(error);
            });
        });
    }
  }

  /**
   * @description alert to show a importance to be a professional.
   */
  public alertInformation() {
    this.alert.simpleAlert(
      'Profissional Autônomo?',
      'Se você é um profissional autônomo e deseja divulgar seus serviços, deixe essa opção ativa!',
    );
  }

  /**
   * @description validate if user account is valid.
   * @param form view form with all user data values.
   */
  public validateAccount(form: NgForm): boolean {
    this.regex = new Regex();
    if (!form.value.firstName || !form.value.lastName || !form.value.email ||
      !form.value.password || !form.value.confirmPass) {
      this.toast.showToast('Preencha todos os campos!');
      return false;
    }
    if (!this.regex.verifyName(form.value.firstName)) {
      this.toast.showToast('Nome não é valido!');
      return false;
    }
    if (!this.regex.verifyName(form.value.lastName)) {
      this.toast.showToast('Sobrenome não é valido!');
      return false;
    }
    if (!this.regex.verifyEmail(form.value.email)) {
      this.toast.showToast('E-mail não é valido!');
      return false;
    }
    if (!this.regex.verifyPassword(form.value.password)) {
      this.toast.showToast('Senha deve conter no minimo 6 caracteres!');
      return false;
    }
    if (form.value.password !== form.value.confirmPass) {
      this.toast.showToast('As senhas devem ser iguais!');
      return false;
    }
    return true;
  }

  private onError(error?: any) {
    this.loading.hideLoading();
    if (error) {
      switch (error.code) {
        case Constants.NEW_ACCOUNT_EMAIL_IN_USE:
          this.toast.showToast('E-mail em uso por outro usuário.');
          break;
        case Constants.LOGIN_NETWORK_FAIL:
          this.toast.showToast('Erro ao criar conta, verifique sua conexão com a internet.');
          break;
        default:
          this.toast.showToast('Erro ao criar conta.');
          break;
      }
    } else {
      this.toast.showToast('Erro ao criar conta.');
    }

  }

  /**
   * @description save a new user and his authenticated data on database and storage.
   * @param newUser new user created.
   */
  private async saveUser(newUser: any) {
    return this.userProvider.saveNewUser(newUser)
      .then(async () => {
        return this.userProvider.saveUserAuth(newUser.uid)
          .then(() => {
            this.storage.setItem('ACCOUNT_STATUS', 'ACCOUNT_IS_CREATING')
              .then(() => {
                this.setProfileConfigurations();
              });
          });
      });
  }

  /**
   * @description redirect a successfull new account to profile configuration page.
   */
  private setProfileConfigurations() {
    this.navCtrl.setRoot('MyAccountPage');
    this.loading.hideLoading();
    this.toast.showToast('Conta foi criada com sucesso!');
  }
}
