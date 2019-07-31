import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { ProfileProvider } from '../profile/profile';
import { AppConfig } from '../../model/static/static';
import firebase from 'firebase';
import { Profile } from '../../model/profile/profile';

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
    return this.db.collection('users').doc(user.uid).set(user)
      .then(async () => {
        let profile = this.setProfile(user)
        return this.profileProvider.saveProfile(profile)
          .then(async () => {
            AppConfig.USER_PROFILE = profile;
          })
      })
  }

  async getUser(userUid: string): Promise<any> {
    return this.db.collection('users').doc(userUid)
      .get()
      .toPromise()
  }

  saveUserAuth(userUid: any) {
    console.log('saveUserAuth >> Saving UserAuth')
    return this.storage.setItem('userAuth', userUid)
  }

  getLocalUser() {
    console.log('getLocalUser >> Get User')
    return this.storage.getItem('user')
  }

  setProfile(user: any) {
    let profile: Profile = {
      uid: user.uid,
      nome: user.name,
      email: user.email,
      isCompany: user.isCompany,
      razaoSocial: "",
      cnpjCpf: "",
      telefone: "",
      rua: "",
      bairro: "",
      cidade: "",
      estado: "",
      inscEstadual: "",
      inscMunicipal: "",
      areaAtuacao: "",
      setor: "",
      aboutMe: "",
      profilePhotoUrl: "",
      userGalery: [],
      geoLocation: null,
      userRate: 0,
      userMaxRate: 0,
      userMinRate: 0,
      contractsCount: 0,
      avaliationsCount: 0,
    }

    return profile;
  }
}

