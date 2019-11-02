import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MockSolsPage } from './mock-sols';

@NgModule({
  declarations: [
    MockSolsPage,
  ],
  imports: [
    IonicPageModule.forChild(MockSolsPage),
  ],
})
export class MockSolsPageModule {}
