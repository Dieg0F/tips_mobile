import { NgModule } from '@angular/core';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { DirectivesModule } from '../../../directives/directives.module';
import { MyAccountPage } from './my-account';

@NgModule({
  declarations: [
    MyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(MyAccountPage),
    ComponentsModule,
    DirectivesModule,
    BrMaskerModule,
  ],
  exports: [
    BrMaskerModule,
  ],
})
export class MyAccountPageModule { }
