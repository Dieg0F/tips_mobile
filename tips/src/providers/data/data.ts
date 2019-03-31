import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AppConfig } from '../../model/static/static';

@Injectable()
export class DataProvider {

    constructor() { }

    uploadPhoto(path: string, file: string): Promise<any> {
        if (file) {
            firebase.storage().ref().child(path + AppConfig.USER_PROFILE.uid + '.jpg').put(file);            
            return firebase.storage().ref().child(path + AppConfig.USER_PROFILE.uid + '.jpg').getDownloadURL();
        }
    }

    getFile(path: string): Promise<any> {
        return firebase.storage().ref().child(path + AppConfig.USER_PROFILE.uid + '.jpg').getDownloadURL()
    }
}