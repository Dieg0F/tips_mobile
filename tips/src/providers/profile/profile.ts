import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
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

    async getProfiles() {
        console.log('getProfile >> Get All Profile')
        return this.db.collection<Profile>('/profile',
            (ref: CollectionReference) => ref.orderBy('avaliation', 'asc')).valueChanges();
    }
}
