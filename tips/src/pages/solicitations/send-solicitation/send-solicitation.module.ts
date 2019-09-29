import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendSolicitationPage } from './send-solicitation';

@NgModule({
  declarations: [
    SendSolicitationPage,
  ],
  imports: [
    IonicPageModule.forChild(SendSolicitationPage),
  ],
})
export class SendSolicitationPageModule {}
