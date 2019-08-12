import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractOptionsPage } from './contract-options';

@NgModule({
  declarations: [
    ContractOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractOptionsPage),
  ],
})
export class ContractOptionsPageModule {}
