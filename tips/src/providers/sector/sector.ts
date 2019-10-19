import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UUID } from 'angular2-uuid';
import { Constants } from '../../util/constants/constants';

@Injectable()
export class SectorProvider {

    constructor(
        private db: AngularFirestore) { }

    /**
     * @description request all jobs on database.
     */
    public async getSectors(): Promise<any> {
        return this.db.collection(Constants.SECTORS_COLLECTION).valueChanges();
    }

    /**
     * @description save a new job on database.
     * @param job job to be saved on database.
     */
    public async insertSector(job: any): Promise<void> {
        job.uid = UUID.UUID();
        this.db.collection(Constants.SECTORS_COLLECTION)
            .doc(job.uid).set(job);
    }
}
