import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { ProfileProvider } from '../profile/profile';
import { AppConfig } from '../../model/static/static';

import { Profile } from '../../model/profile/profile';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class UserProvider {

  constructor(
    private db: AngularFirestore,
    private storage: StorageProvider,
    private profileProvider: ProfileProvider) { }

  /**
   * Salva o novo usuário e já cria o seu perfil com os dados basicos
   * @param user Usuário criado
   */
  async saveNewUser(user: any): Promise<void> {
    console.log('saveNewUser >> Criando um novo usuário')
    return this.db.collection(Constants.USERS_COLLECTION).doc(user.uid).set(user)
      .then(async () => {
        let profile = this.profileProvider.setProfile(user)
        return this.profileProvider.saveProfile(profile)
          .then(async () => {
            AppConfig.USER_PROFILE = profile;
          })
      })
  }

  async getUser(userUid: string): Promise<any> {
    return this.db.collection(Constants.USERS_COLLECTION).doc(userUid)
      .get()
      .toPromise()
  }

  saveUserAuth(userUid: any) {
    console.log('saveUserAuth >> Saving UserAuth')
    return this.storage.setItem(Constants.USER_AUTH_LOCAL_DB, userUid)
  }

  getLocalUser() {
    console.log('getLocalUser >> Get User')
    return this.storage.getItem(Constants.USER_LOCAL_DB)
  }
}

