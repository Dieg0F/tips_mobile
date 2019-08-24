
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

@Injectable()
export class Loading {

    private loader: any

    constructor(public loadingCtrl: LoadingController) { }

    showLoading(loadingMessage: string) {
        this.loader = this.loadingCtrl.create({
            content: loadingMessage
        });

        this.loader.present();
    }

    hideLoading() {
        if (this.loader != undefined) {
            this.loader.dismiss();
        }
    }
}