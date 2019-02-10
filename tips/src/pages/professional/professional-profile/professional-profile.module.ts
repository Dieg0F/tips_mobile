import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessionalProfilePage } from './professional-profile';

@NgModule({
  declarations: [
    ProfessionalProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfessionalProfilePage),
  ],
})
export class ProfessionalProfilePageModule {}
