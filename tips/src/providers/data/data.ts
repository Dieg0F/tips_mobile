import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AppConfig } from '../../model/static/static';

@Injectable()
export class DataProvider {

    constructor() { }

    uploadPhoto(path: string, file: string, userUid: string): Promise<any> {
        if (file) {
            firebase.storage().ref().child(path + userUid + '.jpg').put(file);            
            return firebase.storage().ref().child(path + userUid + '.jpg').getDownloadURL();
        }
    }

    getFile(path: string, userId: string): Promise<any> {
        return firebase.storage().ref().child(path + userId + '.jpg').getDownloadURL()
    }
}