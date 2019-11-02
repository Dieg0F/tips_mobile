import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class Alert {

    constructor(private alertCtrl: AlertController) { }

    /**
     * @description create a simple alert.
     * @param title alert title.
     * @param subTitle alert subtitle.
     */
    public simpleAlert(title: string, subTitle: string) {
        const alert = this.alertCtrl.create({
            title,
            subTitle,
            buttons: ['Ok'],
        });
        alert.present();
    }

    /**
     * @description create a alert with cancel and accept options.
     * @param title alert title.
     * @param subTitle alert subtitle.
     * @param submitFunction alert submit function.
     * @param cancelFunction alert cancel function.
     * @param cancelButtonText alert cancel text button.
     * @param acceptButtonText alert accept text button.
     */
    public confirmAlert(title: string, subTitle: string, submitFunction: any, cancelFunction: any, cancelButtonText: string = 'Cancelar',
        acceptButtonText: string = 'Ok'): Promise<any> {
        const alert = this.alertCtrl.create({
            title,
            message: subTitle,
            buttons: [
                {
                    handler: () => {
                        alert.dismiss()
                            .then(() => {
                                cancelFunction();
                            });
                        return false;
                    },
                    role: 'cancel',
                    text: cancelButtonText,
                },
                {
                    handler: () => {
                        alert.dismiss()
                            .then(() => {
                                submitFunction();
                            });
                        return false;
                    },
                    text: acceptButtonText,
                },
            ],
        });
        return alert.present();
    }
}
