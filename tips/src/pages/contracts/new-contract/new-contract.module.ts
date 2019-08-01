import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewContractPage } from './new-contract';

@NgModule({
  declarations: [
    NewContractPage,
  ],
  imports: [
    IonicPageModule.forChild(NewContractPage),
  ],
})
export class NewContractPageModule {}
