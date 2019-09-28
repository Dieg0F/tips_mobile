import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSolicitationsPage } from './user-solicitations';

@NgModule({
  declarations: [
    UserSolicitationsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserSolicitationsPage),
  ],
})
export class UserSolicitationsPageModule {}
