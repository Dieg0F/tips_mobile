import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitationsFilterPage } from './solicitations-filter';

@NgModule({
  declarations: [
    SolicitationsFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationsFilterPage),
  ],
})
export class SolicitationsFilterPageModule {}
