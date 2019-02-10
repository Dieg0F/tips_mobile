import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';
import { UserProvider } from '../user/user';
import { ProfileProvider } from '../profile/profile';

@Injectable()
export class AppConfigProvider {

  constructor(
    public storage: StorageProvider,
    public userProvider: UserProvider,
    public profileProvider: ProfileProvider) { }

  /**
   * Metodo para verificar se já existe alguma conta logada.
   * Esse método pega do storage o userAuth, user e userProfile
   * Então os salva nas classes estaticas e retorna true, como conta já logada.
   * Caso contrario, ele retorna false, pedindo o login do usuário
   */
  verifyAuth(): boolean {
    let userResponse: any;
    let userAuthResponse: any;
    let userProfileResponse: any;
    this.storage.getItem('userAuth')
      .then(async (userAuth) => {
        return this.storage.getItem('user')
          .then(async (user) => {
            return this.storage.getItem('userProfile')
              .then((userProfile) => {
                userResponse = user
                userAuthResponse = userAuth
                userProfileResponse = userProfile
              })
          })
      })
      .catch((error) => {
        console.log('Error: ', error)
        return false
      })

    if (userResponse && userAuthResponse && userProfileResponse) {
      AppConfig.USER = userResponse
      AppConfig.USER_AUTH = userAuthResponse
      AppConfig.USER_PROFILE = userProfileResponse
      return true
    }
    return false
  }

  /**
   * Método para requisitar a partir do uid do usuário, os dados de perfil e conta
   * Se todos vierem corretos, os salva nos objetos estaticos e retorna true para login
   * Caso contrario retorna um false informando que houve um erro no login
   * @param userAuthUid User Uid - Usado para requisitar ao database o perfil e usuário
   */
  appLogin(userAuth: any) {
    let userResponse: any;
    let userAuthResponse: any;
    let userProfileResponse: any;

    this.storage.setItem('userAuth', userAuth)
      .then(async () => {
        return this.userProvider.getUser(userAuth.uid)
          .then(async (user) => {
            return this.profileProvider.getProfile(userAuth.uid)
              .then(async (userProfile) => {
                userResponse = user.data()
                userAuthResponse = userAuth
                userProfileResponse = userProfile.data()

                if (userResponse && userAuthResponse && userProfileResponse) {
                  console.log("Requests: ")
                  console.log("       userResponse: ", userResponse)
                  console.log("       userAuthResponse: ", userAuthResponse)
                  console.log("       userProfileResponse: ", userProfileResponse)

                  return this.userProvider.saveUserDataOnStorage(userResponse)
                    .then(async () => {
                      return this.profileProvider.saveProfileOnStorage(userProfileResponse)
                        .then(() => {
                          AppConfig.USER = userResponse
                          AppConfig.USER_AUTH = userAuthResponse
                          AppConfig.USER_PROFILE = userProfileResponse
                          AppConfig.HAS_USER = true;
                        })
                    })
                }
              })
          })
      })
      .catch((error) => {
        console.log("Error: ", error)
      })
  }
}