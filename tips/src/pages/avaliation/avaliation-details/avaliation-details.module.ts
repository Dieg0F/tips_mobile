import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvaliationDetailsPage } from './avaliation-details';

@NgModule({
  declarations: [
    AvaliationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AvaliationDetailsPage),
  ],
})
export class AvaliationDetailsPageModule {}
