import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppConfigPage } from './app-config';

@NgModule({
  declarations: [
    AppConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(AppConfigPage),
  ],
})
export class AppConfigPageModule {}
