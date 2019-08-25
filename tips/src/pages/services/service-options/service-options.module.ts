import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceOptionsPage } from './service-options';

@NgModule({
  declarations: [
    ServiceOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceOptionsPage),
  ],
})
export class ServiceOptionsPageModule {}
