
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class Loading {

    private loader: any;

    constructor(public loadingCtrl: LoadingController) { }

    /**
     * @description create a loading dialog.
     * @param loadingMessage message to be show on load dialog.
     */
    public showLoading(loadingMessage: string): Promise<any> {
        this.loader = this.loadingCtrl.create({
            content: loadingMessage,
        });

        return this.loader.present();
    }

    /**
     * @description hide loading dialog.
     */
    public hideLoading() {
        this.loader.dismiss();
    }

    /**
     * @description hide loading dialog.
     */
    public hideLoadingPromise(): Promise<any> {
        if (this.loader) { return this.loader.dismiss(); }
    }
}
