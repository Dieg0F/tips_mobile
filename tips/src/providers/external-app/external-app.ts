import { Injectable } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';

@Injectable()
export class ExternalAppProvider {

    constructor(
        public platform: Platform,
        public appAvailability: AppAvailability) {
    }

    public launchExternalApp(iosSchemaName: string, androidPackageName: string, appUrl: string, httpUrl: string, userName: string) {
        let app: string;
        if (this.platform.is('ios')) {
            app = iosSchemaName;
        } else if (this.platform.is('android')) {
            app = androidPackageName;
        } else {
            const browser = new InAppBrowser().create(httpUrl + userName, '_system');
            return;
        }

        this.appAvailability.check(app).then(
            () => { // success callback
                const browser = new InAppBrowser().create(appUrl + userName, '_system');
            },
            () => { // error callback
                const browser = new InAppBrowser().create(httpUrl + userName, '_system');
            },
        );
    }

    public openInstagram(userName: string) {
        this.launchExternalApp('instagram://', 'com.instagram.android', 'instagram://user?username=',
            'https://www.instagram.com/', userName);
    }

    public openFacebook(userName: string) {
        this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', userName);
    }

    public openWhatsApp(userNumber: string) {
        this.launchExternalApp('whatsapp://', 'com.whatsapp', 'whatsapp://send?phone=', 'https://web.whatsapp.com//', userNumber);
    }

    public openPhoneApp(phoneNumber: string) {
        this.launchExternalApp('phone//', 'com.phone', 'phone//tel:', 'tel:', phoneNumber);
    }

    public openMailApp(email: string) {
        this.launchExternalApp('mail//', 'com.mail', 'mail//mailto:', 'mailto:', email);
    }

    public openMapsApp(fullAddress) {
        this.launchExternalApp('comgooglemaps//', 'com.google.maps', 'comgooglemaps://?q=', 'geo:?q=', fullAddress);
    }
}
