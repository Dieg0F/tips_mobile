import { Service } from './../../model/service/service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

import firebase from 'firebase';

@Injectable()
export class SolicitationProvider {

    constructor(private db: AngularFirestore) { }

    async createSolicitation(service: any): Promise<void> {
        console.log('createService >> CReating Service :: ', service.uId)
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(service.uId)
            .set(service)
    }

    async updateSolicitation(service: any): Promise<void> {
        console.log('updateService >> Updating Service :: ', service.uId)
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(service.uId)
            .set(service)
    }

    async getSolicitaiton(serviceUid: string): Promise<any> {
        console.log('getService >> Get Service')
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(serviceUid)
            .get()
            .toPromise()
    }

    async getReceivedSolicitations(userId: string): Promise<any> {
        return this.db.collection(Constants.SOLICITATION_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('hiredUid', '==', userId) };
                query = query.orderBy('date', 'desc');
                return query;
            }).valueChanges()
    }

    async getDoneSolicitations(userId: string): Promise<any> {
        return this.db.collection(Constants.SOLICITATION_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('contractorUid', '==', userId) };
                query = query.orderBy('date', 'desc');
                return query;
            }).valueChanges()
    }
}

