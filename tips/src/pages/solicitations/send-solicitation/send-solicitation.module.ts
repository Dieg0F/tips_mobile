import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { SendSolicitationPage } from './send-solicitation';

@NgModule({
  declarations: [
    SendSolicitationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendSolicitationPage),
    ComponentsModule,
  ],
})
export class SendSolicitationPageModule { }
