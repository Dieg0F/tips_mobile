import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitySearchPage } from './city-search';

@NgModule({
  declarations: [
    CitySearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CitySearchPage),
  ],
})
export class CitySearchPageModule {}
