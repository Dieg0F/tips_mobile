import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LauncherAppPage } from './launcher-app';

@NgModule({
  declarations: [
    LauncherAppPage,
  ],
  imports: [
    IonicPageModule.forChild(LauncherAppPage),
  ],
})
export class LauncherAppPageModule {}
