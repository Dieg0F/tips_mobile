import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { SolicitationDetailsPage } from './solicitation-details';

@NgModule({
  declarations: [
    SolicitationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationDetailsPage),
    ComponentsModule,
  ],
})
export class SolicitationDetailsPageModule { }
