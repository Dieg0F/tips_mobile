import { Injectable } from '@angular/core';

import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { AppConfig } from '../../model/static/static';
import { StorageProvider } from '../storage/storage';

import { FilterOptions } from '../../model/FilterOptions/FilterOptions';
import { Profile } from '../../model/profile/profile';
import { Constants } from '../../util/constants/constants';
import { FirebaseProvider } from '../firebase/firebase';

@Injectable()
export class ProfileProvider {

    constructor(
        private db: AngularFirestore,
        private firebaseProvider: FirebaseProvider,
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
        return this.firebaseProvider.getDataWithFilters(Constants.PROFILES_COLLECTION, (ref) => {
            let query: CollectionReference | Query = ref;
            if (filter.profileName !== '') { query = query.where('name.firstName', '==', filter.profileName); }
            if (filter.profileState !== '') { query = query.where('state', '==', filter.profileState); }
            if (filter.profileCity !== '') { query = query.where('city', '==', filter.profileCity); }
            if (filter.profileJob !== '') { query = query.where('job', '==', filter.profileJob); }
            if (filter.profileRate !== 0) {
                query = query.where('userRateStars', '==', filter.profileRate);
            } else { query = query.orderBy('userRate', 'desc'); }
            return query.where('hideMyProfile', '==', false)
                .where('isActive', '==', true)
                .where('isAPro', '==', true)
                .limit(limit);
        });
        // return this.db.collection(Constants.PROFILES_COLLECTION, (ref) => {
        //     let query: CollectionReference | Query = ref;
        //     if (filter.profileName !== '') { query = query.where('name.firstName', '==', filter.profileName); }
        //     if (filter.profileState !== '') { query = query.where('state', '==', filter.profileState); }
        //     if (filter.profileCity !== '') { query = query.where('city', '==', filter.profileCity); }
        //     if (filter.profileJob !== '') { query = query.where('job', '==', filter.profileJob); }
        //     if (filter.profileRate !== 0) {
        //         query = query.where('userRateStars', '==', filter.profileRate);
        //     } else { query = query.orderBy('userRate', 'desc'); }
        //     return query.where('hideMyProfile', '==', false)
        //         .where('isActive', '==', true)
        //         .where('isAPro', '==', true)
        //         .limit(limit);
        // }).valueChanges();
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
            isActive: false,
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
            userRateStars: 0,
            userMaxRate: 0,
            userMinRate: 0,
            solicitationCount: 0,
            avaliationsCount: 0,
            deviceToken: '',
            social: {
                facebook: '',
                showFacebook: false,
                instagram: '',
                showInstagram: false,
                whatsapp: '',
                showWhatsApp: false,
                directCall: false,
            },
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
