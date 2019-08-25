import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewServicePage } from './new-service';

@NgModule({
  declarations: [
    NewServicePage,
  ],
  imports: [
    IonicPageModule.forChild(NewServicePage),
  ],
})
export class NewServicePageModule {}
