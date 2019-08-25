import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserServicesPage } from './user-services';

@NgModule({
  declarations: [
    UserServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserServicesPage),
  ],
})
export class UserServicesPageModule {}
