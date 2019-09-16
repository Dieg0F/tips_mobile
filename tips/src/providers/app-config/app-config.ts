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

@Injectable()
export class AppConfigProvider {

  constructor(
    public storage: StorageProvider,
    public userProvider: UserProvider,
    public dataProvider: DataProvider,
    public toast: Toast,
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
  async appLogin(userAuth: any) {
    let userProfileResponse: Profile;

    await this.storage.setItem(Constants.USER_AUTH_LOCAL_DB, userAuth)
      .then(async () => {
        return this.profileProvider.getProfile(userAuth.uid)
          .then(async (userProfile) => {
            userProfileResponse = userProfile.data();
            if (userProfileResponse) {
              console.log("AppConfigProvider | User profile: ", userProfileResponse);
              return this.notifications.getToken()
                .then(async (token) => {
                  userProfileResponse.deviceToken = token;
                  return this.profileProvider.saveProfile(userProfileResponse)
                    .then(async () => {
                      return this.profileProvider.saveProfileOnStorage(userProfileResponse)
                        .then(async () => {
                          console.log("AppConfigProvider | User profile has been saved on storage!");
                          AppConfig.USER_PROFILE = userProfileResponse
                          AppConfig.HAS_USER = true;
                        })
                    })
                })
            }
          })
      })
      .catch((error) => {
        console.log("Error: ", error)
      })
  }
}
