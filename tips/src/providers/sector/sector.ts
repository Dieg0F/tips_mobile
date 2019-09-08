import { UUID } from 'angular2-uuid';
import { Constants } from "../../util/constants/constants";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable } from "@angular/core";

@Injectable()
export class SectorProvider {

    constructor(
        private db: AngularFirestore) { }

    async getSectorsByArea(areaUid: string): Promise<any> {
        console.log('getSectors >> Get All Sectors', areaUid)

        return this.db.collection(Constants.SECTORS_COLLECTION, ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            return query.where('areaUid', '==', areaUid);
        }).valueChanges()
    }

    async getSectors(areaUid: string): Promise<any> {
        console.log('getSectors >> Get All Sectors', areaUid)

        return this.db.collection(Constants.SECTORS_COLLECTION).valueChanges()
    }

    async insertSector(sector: any): Promise<void> {
        console.log('insertSector >> sector', sector)
        sector.uid = UUID.UUID();
        this.db.collection(Constants.SECTORS_COLLECTION)
            .doc(sector.uid).set(sector)
    }
}