import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolicitationManagerPage } from './solicitation-manager';

@NgModule({
  declarations: [
    SolicitationManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationManagerPage),
  ],
})
export class SolicitationManagerPageModule {}
