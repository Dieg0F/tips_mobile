import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../../providers/auth/auth';
import { Loading } from '../../../util/loading/loading';
import { Alert } from '../../../util/alert/alert';
import { Toast } from '../../../util/toast/toast';
import { UserProvider } from '../../../providers/user/user';
import { Regex } from '../../../util/regex/regex';

@IonicPage()
@Component({
  selector: 'page-new-account',
  templateUrl: 'new-account.html',
})
export class NewAccountPage {

  private regex: Regex;
  public isAPro: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider: UserProvider,
    public loading: Loading,
    public alert: Alert,
    public toast: Toast) { }

  newAccount(form: NgForm): void {
    if (this.validateAccount(form)) {
      this.loading.showLoading('Estamos criando a sua conta...')
        .then(() => {
          this.authProvider.createNewAccount(form.value.email, form.value.password)
            .then((result) => {
              let newUser = {
                uid: result.user.uid,
                name: form.value.name,
                email: form.value.email,
                isAPro: form.value.isAPro,
                accountType: 'APPLICATION'
              }
              return this.saveUser(newUser);
            })
            .catch(() => {
              this.loading.hideLoading();
              this.alert.simpleAlert('Opps!', 'Houve um erro ao criar conta!');
            });
        })
    }
  }

  private async saveUser(newUser: any) {
    return this.userProvider.saveNewUser(newUser)
      .then(async () => {
        return this.userProvider.saveUserAuth(newUser.uid)
          .then(() => {
            this.setProfileConfigurations();
          })
      })
  }

  private setProfileConfigurations() {
    this.navCtrl.setRoot('ProfileConfigurationPage');
    this.navCtrl.goToRoot;
    this.loading.hideLoading();
    this.toast.showToast('Conta foi criada com sucesso!');
  }

  alertInformation() {
    this.alert.simpleAlert(
      "Sou um profissional?",
      "Se você é um profissional e quer divilgar seu serviços, deixe essa opção ativa!"
    )
  }

  validateAccount(form: NgForm): Boolean {
    this.regex = new Regex
    if (!form.value.name || !form.value.email ||
      !form.value.password || !form.value.confirmPass) {
      this.toast.showToast('Preencha todos os campos!')
      return false
    }
    if (!this.regex.verifyName(form.value.name)) {
      this.toast.showToast('Nome não é valido!')
      return false
    }
    if (!this.regex.verifyEmail(form.value.email)) {
      this.toast.showToast('E-mail não é valido!')
      return false
    }
    if (!this.regex.verifyPassword(form.value.password)) {
      this.toast.showToast('Senha deve conter no minimo 6 caracteres!')
      return false
    }
    if (form.value.password != form.value.confirmPass) {
      this.toast.showToast('As senhas devem ser iguais!')
      return false
    }
    return true
  }
}
