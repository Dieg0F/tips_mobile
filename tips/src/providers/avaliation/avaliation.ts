import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';
import { Avaliation } from '../../model/avaliation/avaliation';

@Injectable()
export class AvaliationProvider {

    constructor(private db: AngularFirestore) { }

    async saveAvaliation(avaliation: Avaliation): Promise<void> {
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

    async getAvaliationByUser(evaluatorUid: string = null, ratedUid: string = null): Promise<any> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (evaluatorUid) { query = query.where('evaluatorUid', '==', evaluatorUid) };
                if (ratedUid) { query = query.where('ratedUid', '==', ratedUid) };
                query = query.orderBy('rate', 'desc')
                return query;
            }).valueChanges()
    }
}