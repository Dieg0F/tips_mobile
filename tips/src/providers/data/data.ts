import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AppConfig } from '../../model/static/static';

@Injectable()
export class DataProvider {

    constructor() { }

    uploadPhoto(path: string, file: string) {
        if (file) {
            var uploadTask = firebase.storage().ref().child(path + AppConfig.USER_AUTH.uid + '.jpg')
                .put(file);
            return uploadTask;
        }
    }

    getFile(path: string) {
        return firebase.storage().ref().child(path + AppConfig.USER_AUTH.uid + '.jpg').getDownloadURL()
    }
}