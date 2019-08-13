import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class ContractProvider {

    constructor(private db: AngularFirestore) { }

    async createContract(contract: any): Promise<void> {
        console.log('createContract >> CReating Contract :: ', contract.uId)
        return this.db.collection(Constants.CONTRACTS_COLLECTION)
            .doc(contract.uId)
            .set(contract)
    }

    async updateContract(contract: any): Promise<void> {
        console.log('createContract >> CReating Contract :: ', contract.uId)
        return this.db.collection(Constants.CONTRACTS_COLLECTION)
            .doc(contract.uId)
            .set(contract)
    }

    async getContract(contractUid: string): Promise<any> {
        console.log('getContract >> Get Contract')
        return this.db.collection(Constants.CONTRACTS_COLLECTION)
            .doc(contractUid)
            .get()
            .toPromise()
    }

    async getContracts(userId: string): Promise<any> {
        return this.db.collection(Constants.CONTRACTS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('userUid', '==', userId) };
                query = query.orderBy('date', 'desc')
                return query;
            }).valueChanges()
    }

    async getContractsByUser(userId: string = null, hiredUid: string = null): Promise<any> {
        return this.db.collection(Constants.CONTRACTS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('userUid', '==', userId) };
                if (hiredUid) { query = query.where('hiredUid', '==', hiredUid) };
                query = query.orderBy('date', 'desc')
                return query;
            }).valueChanges()
    }
}