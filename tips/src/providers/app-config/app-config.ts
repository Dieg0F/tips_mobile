import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';
import { UserProvider } from '../user/user';
import { ProfileProvider } from '../profile/profile';
import { Toast } from '../../util/toast/toast';
import { DataProvider } from '../data/data';

@Injectable()
export class AppConfigProvider {

  constructor(
    public storage: StorageProvider,
    public userProvider: UserProvider,
    public dataProvider: DataProvider,
    public toast: Toast,
    public profileProvider: ProfileProvider) { }

  /**
   * Metodo para verificar se já existe alguma conta logada.
   * Esse método pega do storage o userAuth, user e userProfile
   * Então os salva nas classes estaticas e retorna true, como conta já logada.
   * Caso contrario, ele retorna false, pedindo o login do usuário
   */
  async verifyAuth(): Promise<any> {
    console.log("verifyAuth")
    return this.storage.getItem('userProfile')
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
  appLogin(userAuth: any) {
    let userProfileResponse: any;

    this.storage.setItem('userAuth', userAuth)
      .then(async () => {
        return this.profileProvider.getProfile(userAuth.uid)
          .then(async (userProfile) => {
            userProfileResponse = userProfile.data()
            if (userProfileResponse) {
              console.log("Requests: ")
              console.log("       userProfileResponse: ", userProfileResponse)
              return this.profileProvider.saveProfileOnStorage(userProfileResponse)
                .then(async () => {
                  AppConfig.USER_PROFILE = userProfileResponse
                  AppConfig.HAS_USER = true;
                })
            }
          })
      })
      .catch((error) => {
        console.log("Error: ", error)
      })
  }
}
