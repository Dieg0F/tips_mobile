
import { Injectable } from "@angular/core";
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class Notifications {

    public deviceToken: string = "";

    constructor(
        private fcm: FCM
    ) { }

    initService() {
        console.log("Notifications | Init notification service!");
        this.serviceObservable();
    }

    serviceObservable() {
        console.log("Notifications | Starting notification observable!");
        this.fcm.onNotification()
            .subscribe(data => {
                console.log("Data: ", data)
                if (data.wasTapped) {
                    console.log("Received in background");
                } else {
                    console.log("Received in foreground");
                };
            });

        this.fcm.onTokenRefresh()
            .subscribe(token => {
                console.log("Notifications | Device token has been changed!");
                this.deviceToken = token;
            });
    }

    getToken(): Promise<string> {
        console.log("Notifications | Requesting device token!");
        return this.fcm.getToken().then(() => {
            return ""
        }).catch(() => {
            return ""
        })
    }

    //this.fcm.getToken()
}