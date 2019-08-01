import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserContractsPage } from './user-contracts';

@NgModule({
  declarations: [
    UserContractsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserContractsPage),
  ],
})
export class UserContractsPageModule {}
