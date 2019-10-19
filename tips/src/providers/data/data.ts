import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AppConfig } from '../../model/static/static';

@Injectable()
export class DataProvider {

    constructor() { }

    /**
     * @description upload user profile photo.
     * @param path photo path.
     * @param file image file.
     * @param userUid user unique id.
     */
    public uploadPhoto(path: string, file: string, userUid: string): Promise<any> {
        if (file) {
            firebase.storage().ref().child(path + userUid + '.jpg').put(file);
            return firebase.storage().ref().child(path + userUid + '.jpg').getDownloadURL();
        }
    }

    /**
     * @description request image download url.
     * @param path image path.
     * @param userId user unique id.
     */
    public getFile(path: string, userId: string): Promise<any> {
        return firebase.storage().ref().child(path + userId + '.jpg').getDownloadURL();
    }
}
