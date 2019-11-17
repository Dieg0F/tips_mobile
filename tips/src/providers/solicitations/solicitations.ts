import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class SolicitationProvider {

    constructor(private db: AngularFirestore) { }

    /**
     * @description update solicitation on database.
     * @param service solicitation to be saved on database.
     */
    public async createSolicitation(service: any): Promise<void> {
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(service.uId)
            .set(service);
    }

    /**
     * @description update solicitation on database.
     * @param service solicitation to be update on database.
     */
    public async updateSolicitation(service: any): Promise<void> {
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(service.uId)
            .set(service);
    }

    /**
     * @description request service by id.
     * @param serviceUid service unique id.
     */
    public async getSolicitaiton(serviceUid: string): Promise<any> {
        return await this.db.collection(Constants.SOLICITATION_COLLECTION)
            .doc(serviceUid)
            .get()
            .toPromise();
    }

    /**
     * @description request all received done solicitations.
     * @param userId user unique uid.
     */
    public async getReceivedSolicitations(userId: string): Promise<any> {
        return this.db.collection(Constants.SOLICITATION_COLLECTION,
            (ref) => {
                let query: CollectionReference | Query = ref;
                if (userId) { query = query.where('hiredUid', '==', userId); }
                query = query.orderBy('date', 'desc');
                return query;
            }).valueChanges();
    }

    /**
     * @description request all user done solicitations.
     * @param userId user unique uid.
     */
    public async getDoneSolicitations(userId: string): Promise<any> {
        return this.db.collection(Constants.SOLICITATION_COLLECTION,
            (ref) => {
                let query: CollectionReference | Query = ref;
                if (userId) { query = query.where('contractorUid', '==', userId); }
                query = query.orderBy('date', 'desc');
                return query;
            }).valueChanges();
    }
}
