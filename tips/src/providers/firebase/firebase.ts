import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';


@Injectable()
export class FirebaseProvider {

  constructor(private db: AngularFirestore) { }

  public async getDataWithFilters(ref: string, query: any) {
    var timeout = setTimeout(() => {
      console.log('Time is over!');
    }, 30000);
    const observable = await this.db.collection(ref, query).valueChanges();
    if (observable) {
      clearTimeout(timeout);
      timeout = undefined;
      console.log('Timeout is clear!');
    }
    return observable;
  }

}
