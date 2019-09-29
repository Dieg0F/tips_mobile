import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitationDetailsPage } from './solicitation-details';

@NgModule({
  declarations: [
    SolicitationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationDetailsPage),
  ],
})
export class SolicitationDetailsPageModule {}
