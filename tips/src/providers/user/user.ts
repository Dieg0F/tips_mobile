import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppConfig } from '../../model/static/static';
import { Constants } from '../../util/constants/constants';
import { Notifications } from '../../util/notifications/notifications';
import { ProfileProvider } from '../profile/profile';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class UserProvider {

  constructor(
    private db: AngularFirestore,
    private storage: StorageProvider,
    private notifications: Notifications,
    private profileProvider: ProfileProvider) { }

  /**
   * Salva o novo usuário e já cria o seu perfil com os dados basicos
   * @param user Usuário criado
   */
  public async saveNewUser(user: any): Promise<void> {
    return this.db.collection(Constants.USERS_COLLECTION).doc(user.uid).set(user)
      .then(async () => {
        const profile = this.profileProvider.setProfile(user);
        return this.notifications.getToken()
          .then(async (token) => {
            profile.deviceToken = token;
            return this.profileProvider.saveProfile(profile)
              .then(async () => {
                AppConfig.USER_PROFILE = profile;
              });
          });
      });
  }

  /**
   * @description request user form database.
   * @param userUid user unique id.
   */
  public async getUser(userUid: string): Promise<any> {
    return this.db.collection(Constants.USERS_COLLECTION).doc(userUid)
      .get()
      .toPromise();
  }

  /**
   * @description save user form storage.
   * @param userUid user unique id.
   */
  public saveUserAuth(userUid: any) {
    return this.storage.setItem(Constants.USER_AUTH_LOCAL_DB, userUid);
  }

  /**
   * @description request user form storage.
   * @param userUid user unique id.
   */
  public getLocalUser() {
    return this.storage.getItem(Constants.USER_LOCAL_DB);
  }
}
