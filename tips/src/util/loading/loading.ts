
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

@Injectable()
export class Loading {

    private loader: any

    constructor(public loadingCtrl: LoadingController) { }

    showLoading(loadingMessage: string): Promise<any> {
        this.loader = this.loadingCtrl.create({
            content: loadingMessage
        });

        return this.loader.present();
    }

    hideLoading() {
        this.loader.dismiss();
    }

    hideLoadingPromise(): Promise<any> {
        if (this.loader) return this.loader.dismiss();
    }
}