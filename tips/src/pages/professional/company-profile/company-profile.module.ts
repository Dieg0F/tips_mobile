import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyProfilePage } from './company-profile';

@NgModule({
  declarations: [
    CompanyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyProfilePage),
  ],
})
export class CompanyProfilePageModule {}
