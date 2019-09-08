import { UUID } from 'angular2-uuid';
import { Constants } from "../../util/constants/constants";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class AreaProvider {

    constructor(
        private db: AngularFirestore) { }

    async getAreas(): Promise<any> {
        console.log('getAreas >> Get All Areas')
        return this.db.collection(Constants.AREAS_COLLECTION)
            .valueChanges();
    }

    async insertArea(area: any): Promise<void> {
        console.log('insertArea >> area', area)
        area.uId = UUID.UUID();
        this.db.collection(Constants.AREAS_COLLECTION)
            .doc(area.uId).set(area)
    }
}