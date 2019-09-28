import { Service } from './../../model/service/service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Constants } from '../../util/constants/constants';

import firebase from 'firebase';

@Injectable()
export class ServiceProvider {

    constructor(private db: AngularFirestore) { }

    async createService(service: any): Promise<void> {
        console.log('createService >> CReating Service :: ', service.uId)
        return await this.db.collection(Constants.SERVICES_COLLECTION)
            .doc(service.uId)
            .set(service)
    }

    async updateService(service: any): Promise<void> {
        console.log('updateService >> Updating Service :: ', service.uId)
        return await this.db.collection(Constants.SERVICES_COLLECTION)
            .doc(service.uId)
            .set(service)
    }

    async updateMultipleService(service: Service): Promise<void> {
        console.log('updateMultipleService >> Updating Service :: ', service.uId)
        return await firebase.firestore().collection(Constants.SERVICES_COLLECTION)
            .doc(service.uId).update(service);
    }

    async getService(serviceUid: string): Promise<any> {
        console.log('getService >> Get Service')
        return await this.db.collection(Constants.SERVICES_COLLECTION)
            .doc(serviceUid)
            .get()
            .toPromise()
    }

    async getServiceByServiceId(service: any): Promise<any> {
        console.log('getServiceByServiceId >> Get Service : ', service.serviceId)
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (service.serviceId) { query = query.where('serviceId', '==', service.serviceId) };
                return query;
            }).valueChanges();
    }

    async getServiceById(serviceUid: String): Promise<any> {
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (serviceUid) { query = query.where('serviceId', '==', serviceUid) };
                return query;
            }).valueChanges();
    }

    async getServices(userId: string): Promise<any> {
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('ownerUid', '==', userId) };
                query = query.orderBy('date', 'desc');
                query = query.where('isRemoved', '==', false)
                return query;
            }).valueChanges()
    }

    async getServicesByUser(userId: string = null, hiredUid: string = null): Promise<any> {
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('userUid', '==', userId) };
                if (hiredUid) { query = query.where('hiredUid', '==', hiredUid) };
                query = query.orderBy('date', 'desc')
                return query;
            }).valueChanges()
    }

    async updateServiceAction(service: any, userId: string): Promise<any> {
        service.lastActionByUserUid = userId;
        return await this.updateService(service);
    }
}