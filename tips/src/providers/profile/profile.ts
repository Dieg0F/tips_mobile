import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, CollectionReference, fromCollectionRef, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';
import { Profile } from '../../model/profile/profile';
import { Observable } from 'rxjs';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    async saveProfile(profile: any): Promise<void> {
        console.log('saveProfile >> Saving Profile')
        this.db.collection('profile').doc(profile.uid).set(profile)
            .then(async () => {
                return this.saveProfileOnStorage(profile)
            })
    }

    async saveProfileOnStorage(profile: any): Promise<void> {
        return this.storage.setItem('userProfile', profile)
            .then(() => {
                AppConfig.USER_PROFILE = profile;
            });
    }

    async getProfile(userUid: string): Promise<any> {
        console.log('getProfile >> Get Profile')
        return this.db.collection('profile').doc(userUid)
            .get()
            .toPromise()
    }

    async getProfiles(filter: any) {

        console.log('getProfile >> Get All Profile :: Filter', filter)

        return this.db.collection('profile', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (filter.nome) { query = query.where('nome', '==', filter.nome) };
            if (filter.cidade) { query = query.where('cidade', '==', filter.cidade) };
            if (filter.estado) { query = query.where('estado', '==', filter.estado) };
            if (filter.setor) { query = query.where('setor', '==', filter.setor) };
            if (filter.areaAtuacao) { query = query.where('areaAtuacao', '==', filter.areaAtuacao) };
            if (filter.userRate) { query = query.where('userRate', '==', filter.userRate) }
            else { query = query.orderBy('userRate', 'desc') };
            return query;
        }).valueChanges()

    }
}
