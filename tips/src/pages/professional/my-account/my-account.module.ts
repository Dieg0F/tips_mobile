import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    MyAccountPage
  ],
  imports: [
    IonicPageModule.forChild(MyAccountPage),
    DirectivesModule,
    BrMaskerModule
  ],
  exports: [
    BrMaskerModule
  ]
})
export class MyAccountPageModule { }
