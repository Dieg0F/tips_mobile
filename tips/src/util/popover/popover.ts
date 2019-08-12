import { PopoverController } from 'ionic-angular';
import { Injectable, Component } from '@angular/core';

@Injectable()
export class Popover {
    constructor(public popoverCtrl: PopoverController) { }

    showPopover(popoverPage: any, data?: {}, event?) {

        let popover = this.popoverCtrl.create(popoverPage, data);
        popover.present({
            ev: event
        });
    }
}