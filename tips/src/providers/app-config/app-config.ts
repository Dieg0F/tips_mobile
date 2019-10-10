import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';
import { UserProvider } from '../user/user';
import { ProfileProvider } from '../profile/profile';
import { Toast } from '../../util/toast/toast';
import { DataProvider } from '../data/data';
import { Constants } from '../../util/constants/constants';
import { Profile } from '../../model/profile/profile';
import { Notifications } from '../../util/notifications/notifications';
import { Events } from 'ionic-angular';

const LOGIN_TIMEOUT = 35000;

@Injectable()
export class AppConfigProvider {

  constructor(
    public storage: StorageProvider,
    public userProvider: UserProvider,
    public dataProvider: DataProvider,
    public toast: Toast,
    public events: Events,
    public notifications: Notifications,
    public profileProvider: ProfileProvider) { }

  /**
   * Metodo para verificar se já existe alguma conta logada.
   * Esse método pega do storage o userAuth, user e userProfile
   * Então os salva nas classes estaticas e retorna true, como conta já logada.
   * Caso contrario, ele retorna false, pedindo o login do usuário
   */
  async verifyAuth(): Promise<any> {
    console.log("verifyAuth")
    return this.storage.getItem(Constants.USER_PROFILE_LOCAL_DB)
      .then(async (userProfile) => {
        AppConfig.USER_PROFILE = JSON.parse(userProfile)
        console.log("verifyAuth", AppConfig.USER_PROFILE)
      })
      .catch((error) => {
        console.log('Error: ', error)
      })
  }

  /**
   * Método para requisitar a partir do uid do usuário, os dados de perfil e conta
   * Se todos vierem corretos, os salva nos objetos estaticos e retorna true para login
   * Caso contrario retorna um false informando que houve um erro no login
   * @param userAuthUid User Uid - Usado para requisitar ao database o perfil e usuário
   */
  async appLogin(userId: string) {
    let userProfile: Profile;
    var completed = false;
    setTimeout(() => {
      console.log("AppConfigProvider | AppLogin timeout complete!");
      console.log("AppConfigProvider | Event has been called? ", completed);
      if (!completed) {
        console.log("AppConfigProvider | Calling Event... ");
        this.events.publish('login', undefined);
      }
    }, LOGIN_TIMEOUT)

    await this.storage.setItem(Constants.USER_AUTH_LOCAL_DB, userId)
      .then(async () => {
        return this.profileProvider.getProfile(userId)
          .then(async (userProfileSnap) => {
            userProfile = userProfileSnap.data();
            if (userProfile) {
              return this.notifications.getToken()
                .then(async (token) => {
                  userProfile.deviceToken = token;
                  console.log("Token: ", token)
                  return this.profileProvider.saveProfile(userProfile)
                    .then(async () => {
                      return this.profileProvider.saveProfileOnStorage(userProfile)
                        .then(async () => {
                          this.events.publish('login', userProfile);
                          completed = true;
                        })
                    })
                })
            } else {
              completed = true;
              this.events.publish('login', undefined);
            }
          })
      })
      .catch(() => {
        completed = true;
        this.events.publish('login', undefined);
      })
  }
}
