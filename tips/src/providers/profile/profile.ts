import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AppConfig } from '../../model/static/static';
import { StorageProvider } from '../storage/storage';

import { FilterOptions } from '../../model/FilterOptions/FilterOptions';
import { Profile } from '../../model/profile/profile';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class ProfileProvider {

    constructor(
        public http: HttpClient,
        private db: AngularFirestore,
        private storage: StorageProvider) { }

    /**
     * @description save profile on database.
     * @param profile profile to be saved.
     */
    public async saveProfile(profile: any): Promise<void> {
        this.db.collection(Constants.PROFILES_COLLECTION).doc(profile.uid).set(profile)
            .then(async () => {
                return this.saveProfileOnStorage(profile);
            });
    }

    /**
     * @description save profile on database.
     * @param profile profile to be saved.
     */
    public async saveProfileOnStorage(profile: any): Promise<void> {
        return this.storage.setItem(Constants.USER_PROFILE_LOCAL_DB, profile)
            .then(() => {
                AppConfig.USER_PROFILE = profile;
            });
    }

    /**
     * @description request profile by user id.
     * @param userUid user unique id.
     */
    public async getProfile(userUid: string): Promise<any> {
        return this.db.collection(Constants.PROFILES_COLLECTION).doc(userUid)
            .get()
            .toPromise();
    }

    /**
     * @description request profiles from database.
     * @param filter filter options.
     * @param limit data limit on request.
     */
    public async getProfiles(filter: FilterOptions, limit: number) {
        return this.db.collection(Constants.PROFILES_COLLECTION, (ref) => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (filter.profileName !== '') { query = query.where('nome', '==', filter.profileName); }
            if (filter.profileState !== '') { query = query.where('estado', '==', filter.profileState); }
            if (filter.profileCity !== '') { query = query.where('cidade', '==', filter.profileCity); }
            if (filter.profileJob !== '') { query = query.where('setor', '==', filter.profileJob); }
            if (filter.profileRate !== 0) {
                query = query.where('userRate', '==', filter.profileRate);
            } else { query = query.orderBy('userRate', 'desc'); }
            return query.where('hideMyProfile', '==', false)
                .where('isActive', '==', true)
                .where('isAPro', '==', true)
                .limit(limit);
        }).valueChanges();
    }

    /**
     * @description enable a disabled profile.
     * @param profile profile to be enabled again.
     */
    public async reactiveAccount(profile: Profile) {
        profile.isActive = true;
        return this.saveProfile(profile);
    }

    /**
     * @description build a basic profile object.
     * @param user user data.
     */
    public setProfile(user: any) {
        const profile: Profile = {
            uid: user.uid,
            name: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
            email: user.email,
            isAPro: user.isAPro,
            isActive: true,
            phone: '',
            street: '',
            houseNumber: '',
            district: '',
            city: '',
            state: '',
            cpf: '',
            geoLocation: {
                lat: 0,
                lng: 0,
            },
            job: '',
            aboutMe: '',
            profilePhotoUrl: '',
            hideMyProfile: false,
            userRate: 0,
            userMaxRate: 0,
            userMinRate: 0,
            solicitationCount: 0,
            avaliationsCount: 0,
            deviceToken: '',
        };

        return profile;
    }

    /**
     * @description update profile on memory and storage task.
     */
    public updateProfile() {
        // tslint:disable-next-line:no-console
        console.log('ProfileProvider | Update Profile task created!');
        setInterval(() => {
            // tslint:disable-next-line:no-console
            console.log('ProfileProvider | Update Profile task started!');
            this.getProfile(AppConfig.USER_PROFILE.uid)
                .then((res: any) => {
                    return this.saveProfileOnStorage(res.data()).then(() => {
                        // tslint:disable-next-line:no-console
                        console.log('ProfileProvider | Profile Updated!');
                    });
                }).catch((error) => {
                    // tslint:disable-next-line:no-console
                    console.log('ProfileProvider | Update Profile task error!');
                    // tslint:disable-next-line:no-console
                    console.log('ProfileProvider | Error: ', error);
                });
        }, 10000 * 30);
    }
}
