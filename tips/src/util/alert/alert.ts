import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Alert {

    constructor(private alertCtrl: AlertController) {}

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
    confirmAlert(title: string, subTitle: string, submitFunction: any, cancelFunction: any) {
        let alert = this.alertCtrl.create({
            title: title,
            message: subTitle,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {
                        cancelFunction()
                    }
                },
                {
                    text: 'Ok',
                    handler: () => {
                        submitFunction()
                    }
                }
            ]
        });
        alert.present();
    }
}