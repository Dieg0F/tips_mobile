
import { Injectable } from "@angular/core";
import { FCM } from '@ionic-native/fcm';
import { Events } from "ionic-angular";

@Injectable()
export class Notifications {

    public deviceToken: string = "";

    constructor(
        private fcm: FCM,
        private events: Events,
    ) { }

    initService() {
        console.log("Notifications | Init notification service!");
        this.serviceObservable();
    }

    serviceObservable() {
        console.log("Notifications | Starting notification observable!");
        this.fcm.onNotification()
            .subscribe(data => {
                console.log("Data: ", data);
                this.parseNotification(data);
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
        //return this.fcm.getToken();
        return new Promise((res, err) => { });
    }

    parseNotification(data: any) {
        switch (data.title) {
            case "new_solicitation":
                this.events.publish('NEW_SOLICITATION', data.body);
                break;
            case "update_solicitation":
                this.events.publish('CHANGE_SOLICITATION', data.body);
                break;
            case "new_avaliaiton":
                this.events.publish('NEW_AVALIATION', data.body);
                this.events.publish('CHANGE_AVALIATION', data.body);
                break;
            case "avaliation_update":
                this.events.publish('CHANGE_AVALIATION', data.body);
                break;
            case "update_profile":
                this.events.publish('CHANGE_PROFILE_RATING');
                break;
        }
        console.log("Events: ", this.events);
    }
}