
import { Injectable } from '@angular/core';
import { FCM } from '@ionic-native/fcm';
import { Events } from 'ionic-angular';

@Injectable()
export class Notifications {

    public deviceToken: string = '';

    constructor(
        private fcm: FCM,
        private events: Events,
    ) { }

    /**
     * @description init solicitation service.
     */
    public initService() {
        this.serviceObservable();
    }

    /**
     * @description start notification observable.
     */
    public serviceObservable() {
        this.fcm.onNotification()
            .subscribe((data) => {
                this.parseNotification(data);
            });

        this.fcm.onTokenRefresh()
            .subscribe((token) => {
                this.deviceToken = token;
            });
    }

    /**
     * @description request device token.
     */
    public getToken(): Promise<string> {
        //return this.fcm.getToken();
        return new Promise((res, err) => { res('') });
    }

    /**
     * @description parse all notifications and emit specific event.
     * @param data notification data.
     */
    public parseNotification(data: any) {
        switch (data.title) {
            case 'new_solicitation':
                this.events.publish('NEW_SOLICITATION', data.body);
                break;
            case 'update_solicitation':
                this.events.publish('CHANGE_SOLICITATION', data.body);
                break;
            case 'new_avaliaiton':
                this.events.publish('NEW_AVALIATION', data.body);
                this.events.publish('CHANGE_AVALIATION', data.body);
                break;
            case 'avaliation_update':
                this.events.publish('CHANGE_AVALIATION', data.body);
                break;
            case 'update_profile':
                this.events.publish('CHANGE_PROFILE_RATING');
                break;
        }
    }
}
