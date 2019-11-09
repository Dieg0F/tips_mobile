import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageOptionsPage } from './image-options';

@NgModule({
  declarations: [
    ImageOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageOptionsPage),
  ],
})
export class ImageOptionsPageModule {}
