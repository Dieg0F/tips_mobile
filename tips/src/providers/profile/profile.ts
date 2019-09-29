import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';

import { FilterOptions } from '../../model/FilterOptions/FilterOptions';
import { Constants } from '../../util/constants/constants';
import { Profile } from '../../model/profile/profile';
import { AuthProvider } from '../auth/auth';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private authProvider: AuthProvider,
        private storage: StorageProvider) { }

    async saveProfile(profile: any): Promise<void> {
        console.log('saveProfile >> Saving Profile')
        this.db.collection(Constants.PROFILES_COLLECTION).doc(profile.uid).set(profile)
            .then(async () => {
                return this.saveProfileOnStorage(profile)
            })
    }

    async saveProfileOnStorage(profile: any): Promise<void> {
        console.log('saveProfile on storage >> Saving Profile')
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

    async getProfiles(filter: FilterOptions, limit: number) {
        return this.db.collection(Constants.PROFILES_COLLECTION, ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (filter.profileName != "") { query = query.where('nome', '==', filter.profileName) };
            if (filter.profileState != "") { query = query.where('estado', '==', filter.profileState) };
            if (filter.profileCity != "") { query = query.where('cidade', '==', filter.profileCity) };
            if (filter.profileSector != "") { query = query.where('setor', '==', filter.profileSector) };
            if (filter.profileRate != 0) { query = query.where('userRate', '==', filter.profileRate) }
            else { query = query.orderBy('userRate', 'desc') };
            return query.where('hideMyProfile', '==', false)
                .where('isActive', '==', true)
                .where('isAPro', '==', true)
                .limit(limit)
        }).valueChanges()
    }

    async reactiveAccount(profile: Profile) {
        profile.isActive = true;
        return this.saveProfile(profile);
    }

    setProfile(user: any) {
        let profile: Profile = {
            uid: user.uid,
            nome: user.name,
            email: user.email,
            isAPro: user.isAPro,
            isActive: true,
            telefone: "",
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
            cpf: "",
            areaAtuacao: "",
            setor: "",
            aboutMe: "",
            profilePhotoUrl: "",
            userGalery: [],
            geoLocation: null,
            hideMyProfile: false,
            userRate: 0,
            userMaxRate: 0,
            userMinRate: 0,
            servicesCount: 0,
            avaliationsCount: 0,
            deviceToken: ""
        }

        return profile;
    }
}
