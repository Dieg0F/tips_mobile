import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAvaliationsPage } from './user-avaliations';

@NgModule({
  declarations: [
    UserAvaliationsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAvaliationsPage),
  ],
})
export class UserAvaliationsPageModule {}
