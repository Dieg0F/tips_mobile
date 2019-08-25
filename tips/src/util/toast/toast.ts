import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class Toast {

    constructor(private toastCtrl: ToastController) { }

    showToast(toastMesssage: string): Promise<any> {
        let toast = this.toastCtrl.create({
            message: toastMesssage,
            duration: 3000,
            position: 'bottom'
        });

        return toast.present();
    }
}