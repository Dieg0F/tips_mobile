import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../components/components.module';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ProfilePage)],
})
export class ProfilePageModule { }
