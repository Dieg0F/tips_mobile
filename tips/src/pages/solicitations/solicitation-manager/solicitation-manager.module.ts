import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { SolicitationManagerPage } from './solicitation-manager';

@NgModule({
  declarations: [
    SolicitationManagerPage,
  ],
  imports: [
    IonicPageModule.forChild(SolicitationManagerPage),
    ComponentsModule,
  ],
})
export class SolicitationManagerPageModule { }
