import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Alert {

    constructor(private alertCtrl: AlertController) { }

    // Alert para mensagens simples
    simpleAlert(title: string, subTitle: string) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['Ok']
        });
        alert.present();
    }

    //Alert para confirmações, com ações nos botões, os métodos são passados como parametros.
    confirmAlert(title: string,
        subTitle: string,
        submitFunction: any,
        cancelFunction: any,
        cancelButtonText: string = 'Cancelar',
        acceptButtonText: string = 'Ok'): Promise<any> {
        let alert = this.alertCtrl.create({
            title: title,
            message: subTitle,
            buttons: [
                {
                    text: cancelButtonText,
                    role: 'cancel',
                    handler: () => {
                        alert.dismiss()
                            .then(() => {
                                cancelFunction();
                            })
                        return false;
                    }
                },
                {
                    text: acceptButtonText,
                    handler: () => {
                        alert.dismiss()
                            .then(() => {
                                submitFunction();
                            })
                        return false;
                    }
                }
            ]
        });
        return alert.present();
    }
}