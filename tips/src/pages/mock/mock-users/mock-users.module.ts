import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MockUsersPage } from './mock-users';

@NgModule({
  declarations: [
    MockUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(MockUsersPage),
  ],
})
export class MockUsersPageModule {}
