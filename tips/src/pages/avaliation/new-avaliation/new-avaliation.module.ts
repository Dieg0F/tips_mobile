import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewAvaliationPage } from './new-avaliation';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    NewAvaliationPage,
  ],
  imports: [
    IonicPageModule.forChild(NewAvaliationPage),
    StarRatingModule
    //Ionic2RatingModule
  ],
})
export class NewAvaliationPageModule { }
