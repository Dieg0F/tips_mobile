import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingSearchPage } from './rating-search';

@NgModule({
  declarations: [
    RatingSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingSearchPage),
  ],
})
export class RatingSearchPageModule {}
