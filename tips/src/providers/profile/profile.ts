import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { StorageProvider } from '../storage/storage';
import { AppConfig } from '../../model/static/static';

import { FilterOptions } from '../../model/FilterOptions/FilterOptions';
import { Constants } from '../../util/constants/constants';
import { Profile } from '../../model/profile/profile';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    async saveProfile(profile: any): Promise<void> {
        console.log("ProfileProvider | Saving Profile on Firebase.");
        this.db.collection(Constants.PROFILES_COLLECTION).doc(profile.uid).set(profile)
            .then(async () => {
                return this.saveProfileOnStorage(profile)
            })
    }

    async saveProfileOnStorage(profile: any): Promise<void> {
        console.log("ProfileProvider | Saving Profile on Storage.");
        return this.storage.setItem(Constants.USER_PROFILE_LOCAL_DB, profile)
            .then(() => {
                AppConfig.USER_PROFILE = profile;
            });
    }

    async getProfile(userUid: string): Promise<any> {
        console.log("ProfileProvider | Request profile.");
        console.log("ProfileProvider | Profile Id: ", userUid);
        return this.db.collection(Constants.PROFILES_COLLECTION).doc(userUid)
            .get()
            .toPromise()
    }

    async getProfiles(filter: FilterOptions, limit: number) {
        console.log("ProfileProvider | Get Profiles by search!");
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
        console.log("ProfileProvider | Reactiving Profile.");
        profile.isActive = true;
        return this.saveProfile(profile);
    }

    setProfile(user: any) {
        console.log("ProfileProvider | Creating a profile object.");
        let profile: Profile = {
            uid: user.uid,
            name: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
            email: user.email,
            isAPro: user.isAPro,
            isActive: true,
            phone: "",
            street: "",
            houseNumber: "",
            district: "",
            city: "",
            state: "",
            cpf: "",
            geoLocation: {
                lat: 0,
                lng: 0
            },
            job: "",
            aboutMe: "",
            profilePhotoUrl: "",
            hideMyProfile: false,
            userRate: 0,
            userMaxRate: 0,
            userMinRate: 0,
            solicitationCount: 0,
            avaliationsCount: 0,
            deviceToken: ""
        }

        return profile;
    }

    updateProfile() {
        console.log("ProfileProvider | Update Profile task created!");
        setInterval(() => {
            console.log("ProfileProvider | Update Profile task started!");
            this.getProfile(AppConfig.USER_PROFILE.uid)
                .then((res: any) => {
                    return this.saveProfileOnStorage(res.data()).then(() => {
                        console.log("ProfileProvider | Profile Updated!");
                    })
                }).catch((error) => {
                    console.log("ProfileProvider | Update Profile task error!");
                    console.log("ProfileProvider | Error: ", error);
                })
        }, 10000 * 30);
    }
}
