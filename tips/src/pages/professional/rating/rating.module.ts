import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingPage } from './rating';

@NgModule({
  declarations: [
    RatingPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingPage),
  ],
})
export class RatingPageModule {}
