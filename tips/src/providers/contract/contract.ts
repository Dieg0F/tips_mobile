import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class ContractProvider {

    constructor(private db: AngularFirestore) { }

    async createContract(contract: any): Promise<void> {
        console.log('createContract >> CReating Contract :: ', contract.uId)
        return this.db.collection('contract')
            .doc(contract.uId)
            .set(contract)
    }

    async getContract(contractUid: string): Promise<any> {
        console.log('getContract >> Get Contract')
        return this.db.collection('contract')
            .doc(contractUid)
            .get()
            .toPromise()
    }

    async getContractsByUser(userId: string): Promise<any> {
        return this.db.collection('contract',
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('userUid', '==', userId) };
                query = query.orderBy('date', 'desc')
                return query;
            }).valueChanges()
    }
}