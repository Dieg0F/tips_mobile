import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitationOptionsPage } from './solicitation-options';

@NgModule({
  declarations: [
    SolicitationOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationOptionsPage),
  ],
})
export class SolicitationOptionsPageModule {}
