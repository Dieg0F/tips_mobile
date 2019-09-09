import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateSearchPage } from './state-search';

@NgModule({
  declarations: [
    StateSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(StateSearchPage),
  ],
})
export class StateSearchPageModule {}
