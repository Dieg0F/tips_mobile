import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';

import { FilterOptions } from '../../model/FilterOptions/FilterOptions';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    async saveProfile(profile: any): Promise<void> {
        console.log('saveProfile >> Saving Profile')
        this.db.collection(Constants.PROFILES_COLLECTION).doc(profile.uid).set(profile)
            .then(async () => {
                return this.saveProfileOnStorage(profile)
            })
    }

    async saveProfileOnStorage(profile: any): Promise<void> {
        return this.storage.setItem(Constants.USER_PROFILE_LOCAL_DB, profile)
            .then(() => {
                AppConfig.USER_PROFILE = profile;
            });
    }

    async getProfile(userUid: string): Promise<any> {
        console.log('getProfile >> Get Profile')
        return this.db.collection(Constants.PROFILES_COLLECTION).doc(userUid)
            .get()
            .toPromise()
    }

    async getProfiles(filter: FilterOptions) {

        console.log('getProfile >> Get All Profile :: Filter', filter)

        return this.db.collection(Constants.PROFILES_COLLECTION, ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            query = query.where('hideMyProfile', '==', true)
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
