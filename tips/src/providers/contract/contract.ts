import { Contract } from './../../model/contract/contract';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

import firebase from 'firebase';

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

    async updateMultipleContract(contract: Contract): Promise<void> {
        console.log('createContract >> Updating Contract :: ', contract)
        return firebase.firestore().collection(Constants.CONTRACTS_COLLECTION)
            .doc(contract.uId).update(contract);
    }

    async getContract(contractUid: string): Promise<any> {
        console.log('getContract >> Get Contract')
        return this.db.collection(Constants.CONTRACTS_COLLECTION)
            .doc(contractUid)
            .get()
            .toPromise()
    }

    async getContractByContractId(contract: Contract): Promise<any> {
        console.log('getContractByContractId >> Get Contract : ', contract.contractId)
        return this.db.collection(Constants.CONTRACTS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (contract.contractId) { query = query.where('contractId', '==', contract.contractId) };
                return query;
            }).valueChanges()
    }

    async getContracts(userId: string): Promise<any> {
        return this.db.collection(Constants.CONTRACTS_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('ownerUid', '==', userId) };
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

    async updateContractAction(contract: Contract, userId: string): Promise<any> {
        contract.lastActionByUserUid = userId;
        return this.getContractByContractId(contract)
            .then(async (res) => {
                var otherContract: Contract;
                res.subscribe(async (value) => {
                    value.forEach((element: Contract) => {
                        if (element.ownerUid != userId && element.contractId == contract.contractId) {
                            otherContract = element
                            otherContract.lastActionByUserUid = userId;
                            otherContract.status = contract.status;
                            otherContract.isRemoved = contract.isRemoved;
                        }
                    });
                });
                this.updateMultipleContract(contract).then(async () => { return this.updateMultipleContract(otherContract) });
            })
    }
}