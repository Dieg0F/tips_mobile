import { Injectable } from '@angular/core';
import { PopoverController } from 'ionic-angular';

@Injectable()
export class Popover {
    constructor(public popoverCtrl: PopoverController) { }

    /**
     * @description show popover on view.
     * @param popoverPage popovercomponent to be open.
     * @param data data bo be send as value.
     * @param event event from view.
     */
    public showPopover(popoverPage: any, data?: {}, event?) {

        const popover = this.popoverCtrl.create(popoverPage, data);
        popover.present({
            ev: event,
        });
    }
}
