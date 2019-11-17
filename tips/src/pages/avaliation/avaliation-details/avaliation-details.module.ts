import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { AvaliationDetailsPage } from './avaliation-details';

@NgModule({
  declarations: [
    AvaliationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(AvaliationDetailsPage),
    ComponentsModule,
  ],
})
export class AvaliationDetailsPageModule { }
