import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobSearchPage } from './job-search';

@NgModule({
  declarations: [
    JobSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(JobSearchPage),
  ],
})
export class JobSearchPageModule {}
