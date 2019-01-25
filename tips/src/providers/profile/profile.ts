import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    async saveProfile(profile: any): Promise<void> {
        console.log('Salvando o perfil do usuário')
        console.log('Profile: ', profile)
        return this.db.collection('profile').doc(profile.uid).set(profile)
            .then(() => {
                return this.storage.setItem('userProfile', profile)
            })
    }
}
