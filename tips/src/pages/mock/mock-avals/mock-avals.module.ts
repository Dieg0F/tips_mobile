import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MockAvalsPage } from './mock-avals';

@NgModule({
  declarations: [
    MockAvalsPage,
  ],
  imports: [
    IonicPageModule.forChild(MockAvalsPage),
  ],
})
export class MockAvalsPageModule {}
