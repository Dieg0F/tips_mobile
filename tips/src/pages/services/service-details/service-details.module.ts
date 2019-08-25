import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceDetailsPage } from './service-details';

@NgModule({
  declarations: [
    ServiceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceDetailsPage),
  ],
})
export class ServiceDetailsPageModule {}
