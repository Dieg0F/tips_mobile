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
        console.log('createService >> CReating Service :: ', service.uId)
        return await this.db.collection(Constants.SERVICES_COLLECTION)
            .doc(service.uId)
            .set(service)
    }

    async updateMultipleService(service: Service): Promise<void> {
        console.log('createService >> Updating Service :: ', service)
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

    async getServiceByServiceId(service: Service): Promise<any> {
        console.log('getServiceByServiceId >> Get Service : ', service.serviceId)
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (service.serviceId) { query = query.where('serviceId', '==', service.serviceId) };
                return query;
            }).valueChanges()
    }

    async getServices(userId: string): Promise<any> {
        return await this.db.collection(Constants.SERVICES_COLLECTION,
            ref => {
                let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                if (userId) { query = query.where('ownerUid', '==', userId) };
                query = query.orderBy('date', 'desc')
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

    async updateServiceAction(service: Service, userId: string): Promise<any> {
        service.lastActionByUserUid = userId;
        return await this.getServiceByServiceId(service)
            .then(async (res) => {
                var otherService: Service;
                res.subscribe(async (value) => {
                    value.forEach((element: Service) => {
                        if (element.ownerUid != userId && element.serviceId == service.serviceId) {
                            otherService = element
                            otherService.lastActionByUserUid = userId;
                            otherService.status = service.status;
                            otherService.isRemoved = service.isRemoved;
                        }
                    });
                });
                await this.updateMultipleService(service)
                    .then(async () => {
                        return await this.updateMultipleService(otherService)
                    });
            })
    }
}