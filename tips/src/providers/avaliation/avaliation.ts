import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Avaliation } from '../../model/avaliation/avaliation';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class AvaliationProvider {

    constructor(private db: AngularFirestore) { }

    /**
     * @description save avaliation on database.
     * @param avaliation avaliation to be saved.
     */
    public async saveAvaliation(avaliation: Avaliation): Promise<void> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION)
            .doc(avaliation.uId)
            .set(avaliation);
    }

    /**
     * @description request a avaliation from database by id.
     * @param avaliationUid avaliation unique id.
     */
    public async getAvaliation(avaliationUid: string): Promise<any> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION)
            .doc(avaliationUid)
            .get()
            .toPromise();
    }

    /**
     * @description request a avaliation from database by id.
     * @param avaliationUid avaliation unique id.
     */
    public async getAvaliationById(avaliationUid: string = null): Promise<any> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION).doc(avaliationUid).get().toPromise();
    }

    /**
     * @description request all avaliations from some user.
     * @param evaluatorUid evaluated user unique id.
     * @param ratedUid rated user unique id.
     */
    public async getAvaliationByUser(evaluatorUid: string = null, ratedUid: string = null): Promise<any> {
        return this.db.collection(Constants.AVALIATIONS_COLLECTION,
            (ref) => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (evaluatorUid) { query = query.where('evaluatorUid', '==', evaluatorUid); }
                if (ratedUid) { query = query.where('ratedUid', '==', ratedUid); }
                query = query.orderBy('rate', 'desc');
                return query;
            }).valueChanges();
    }
}
