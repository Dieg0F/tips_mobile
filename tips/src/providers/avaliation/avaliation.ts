import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class AvaliationProvider {

    constructor(private db: AngularFirestore) { }

    async saveAvaliation(avaliation: any): Promise<void> {
        console.log('saveAvaliation >> Saving Avaliation :: ', avaliation.uId)
        return this.db.collection(Constants.AVALIATIONS_COLLECTION)
            .doc(avaliation.uId)
            .set(avaliation)
    }

    async getAvaliation(avaliationUid: string): Promise<any> {
        console.log('getAvaliations >> Get Avaliations')
        return this.db.collection(Constants.AVALIATIONS_COLLECTION)
            .doc(avaliationUid)
            .get()
            .toPromise()
    }

    async getAvaliationByUser(contractorUid: string = null, hiredUid: string = null): Promise<any> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (contractorUid) { query = query.where('contractorUid', '==', contractorUid) };
                if (hiredUid) { query = query.where('hiredUid', '==', hiredUid) };
                query = query.orderBy('rate', 'desc')
                return query;
            }).valueChanges()
    }
}