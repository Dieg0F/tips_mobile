import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, CollectionReference, fromCollectionRef, AngularFirestoreCollection } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';
import { Profile } from '../../model/profile/profile';
import { Observable } from 'rxjs';
import { FilterOptions } from '../../model/FilterOptions/FilterOptions';

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

    async getProfiles(filter: FilterOptions) {

        console.log('getProfile >> Get All Profile :: Filter', filter)

        return this.db.collection('profile', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (filter.profileName) { query = query.where('nome', '==', filter.profileName) };
            if (filter.profileState) { query = query.where('estado', '==', filter.profileState) };
            if (filter.profileCity) { query = query.where('cidade', '==', filter.profileCity) };
            if (filter.profileSector) { query = query.where('setor', '==', filter.profileSector) };
            if (filter.profileArea) { query = query.where('areaAtuacao', '==', filter.profileArea) };
            if (filter.profileRate) { query = query.where('userRate', '==', filter.profileRate) }
            else { query = query.orderBy('userRate', 'desc') };
            return query;
        }).valueChanges()

    }
}
