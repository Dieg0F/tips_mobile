import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AuthUser } from '../../model/AuthUser/authUser';

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
  }

  saveNewUser(user: any): Promise<void> {
    console.log('Criando um novo usuário')
    return this.db.collection('users').doc(user.uid).set(user);
  }

  editProfile(): void {

  }

}
