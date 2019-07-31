import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class AvaliationProvider {

    constructor(private db: AngularFirestore) { }

    async saveAvaliation(avaliation: any): Promise<void> {
        console.log('saveAvaliation >> Saving Avaliation :: ', avaliation.uId)
        return this.db.collection('avaliation')
            .doc(avaliation.uId)
            .set(avaliation)
    }

    async getAvaliation(avaliationUid: string): Promise<any> {
        console.log('getAvaliations >> Get Avaliations')
        return this.db.collection('avaliation')
            .doc(avaliationUid)
            .get()
            .toPromise()
    }

    async getAvaliationByUser(userId: string): Promise<any> {
        return this.db.collection('avaliation',
            ref => ref.where('evaluatedUid', '==', userId))
            .valueChanges()
    }
}