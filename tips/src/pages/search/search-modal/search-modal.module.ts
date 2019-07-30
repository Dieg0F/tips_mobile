import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchModalPage } from './search-modal';

@NgModule({
  declarations: [
    SearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchModalPage),
  ],
})
export class SearchModalPageModule {}
