import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitationObservationPage } from './solicitation-observation';

@NgModule({
  declarations: [
    SolicitationObservationPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationObservationPage),
  ],
})
export class SolicitationObservationPageModule { }
