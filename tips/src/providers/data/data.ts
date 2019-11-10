import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

//import * as firebase from 'firebase/storage';

@Injectable()
export class DataProvider {

    constructor(private data: AngularFireStorage) { }

    /**
     * @description upload user profile photo.
     * @param path photo path.
     * @param file image file.
     * @param userUid user unique id.
     */
    public async uploadPhoto(path: string, file: string, userUid: string): Promise<any> {
        if (file) {

            const upload = await this.data.storage.ref().child(path + userUid + '.jpg').put(file);
            return this.data.storage.ref().child(path + userUid + '.jpg').getDownloadURL();
        }
    }

    /**
     * @description request image download url.
     * @param path image path.
     * @param userId user unique id.
     */
    public getFile(path: string, userId: string): Promise<any> {
        return this.data.storage.ref().child(path + userId + '.jpg').getDownloadURL();
    }
}
