import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PsConfigPage } from './ps-config';

@NgModule({
  declarations: [
    PsConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(PsConfigPage),
  ],
})
export class PsConfigPageModule {}
