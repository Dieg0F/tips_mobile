import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../../components/components.module';
import { ScrollHideDirective } from '../../../util/scrollHeader/scroll-header';

@NgModule({
  declarations: [ProfilePage, ScrollHideDirective],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ProfilePage)]
})
export class ProfilePageModule { }
