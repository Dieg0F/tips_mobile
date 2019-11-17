import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Profile } from '../../model/profile/profile';
import { Constants } from '../../util/constants/constants';
import { Notifications } from '../../util/notifications/notifications';
import { Toast } from '../../util/toast/toast';
import { ProfileProvider } from '../profile/profile';
import { StorageProvider } from '../storage/storage';

const LOGIN_TIMEOUT = 35000;

@Injectable()
export class AppConfigProvider {

  constructor(
    public storage: StorageProvider,
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
  public async verifyAuth(): Promise<any> {
    return this.storage.getItem(Constants.USER_PROFILE_LOCAL_DB);
  }

  /**
   * Método para requisitar a partir do uid do usuário, os dados de perfil e conta
   * Se todos vierem corretos, os salva nos objetos estaticos e retorna true para login
   * Caso contrario retorna um false informando que houve um erro no login
   * @param userAuthUid User Uid - Usado para requisitar ao database o perfil e usuário
   */
  public async appLogin(userId: string) {
    let userProfile: Profile;
    let completed = false;
    setTimeout(() => {
      if (!completed) {
        this.events.publish('login', undefined);
      }
    }, LOGIN_TIMEOUT);

    await this.storage.setItem(Constants.USER_AUTH_LOCAL_DB, userId)
      .then(async () => {
        return this.profileProvider.getProfile(userId)
          .then(async (userProfileSnap) => {
            userProfile = userProfileSnap.data();
            if (userProfile) {
              return this.notifications.getToken()
                .then(async (token) => {
                  userProfile.deviceToken = token;
                  return this.profileProvider.saveProfile(userProfile)
                    .then(async () => {
                      return this.profileProvider.saveProfileOnStorage(userProfile)
                        .then(async () => {
                          this.events.publish('login', userProfile);
                          completed = true;
                        });
                    });
                });
            } else {
              completed = true;
              this.events.publish('login', undefined);
            }
          });
      })
      .catch(() => {
        completed = true;
        this.events.publish('login', undefined);
      });
  }
}
