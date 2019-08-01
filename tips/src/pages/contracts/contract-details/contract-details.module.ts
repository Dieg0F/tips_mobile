import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractDetailsPage } from './contract-details';

@NgModule({
  declarations: [
    ContractDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractDetailsPage),
  ],
})
export class ContractDetailsPageModule {}
