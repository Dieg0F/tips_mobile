import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class Toast {

    constructor(private toastCtrl: ToastController) { }

    /**
     * @description show a toast on view.
     * @param toastMesssage message to be showed on toast.
     */
    public showToast(toastMesssage: string): Promise<any> {
        const toast = this.toastCtrl.create({
            message: toastMesssage,
            duration: 3000,
            position: 'top',
        });

        return toast.present();
    }
}
