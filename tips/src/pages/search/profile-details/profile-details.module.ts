import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { ProfileDetailsPage } from './profile-details';

@NgModule({
  declarations: [
    ProfileDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileDetailsPage),
    ComponentsModule,
  ],
})
export class ProfileDetailsPageModule { }
