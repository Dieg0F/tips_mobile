import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { ProfileProvider } from '../profile/profile';
import { Profile } from '../../model/profile/profile';

@Injectable()
export class UserProvider {

  constructor(
    public http: HttpClient,
    private db: AngularFirestore,
    private storage: StorageProvider,
    private profileProvider: ProfileProvider) { }

  /**
   * Salva o novo usuário e já cria o seu perfil com os dados basicos
   * @param user Usuário criado
   */
  async saveNewUser(user: any): Promise<void> {
    console.log('Criando um novo usuário')
    return this.db.collection('users').doc(user.uid).set(user)
      .then(async () => {
        return this.profileProvider.saveProfile(this.setProfile(user))
          .then(() => {
            return this.storage.setItem('user', user)
          })
      })
  }

  saveUserAuth(userUid: any) {
    return this.storage.setItem('userAuth', userUid)
  }

  setProfile(user: any) {
    console.log('user: ', user)
    let profile = {
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
      aboutMe: ""
    }
    console.log('profile to save: ', profile)

    return profile;
  }
}

