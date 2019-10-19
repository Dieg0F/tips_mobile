import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMenuComponent } from './profile-menu/profile-menu';

@NgModule({
	declarations: [ProfileMenuComponent],
	exports: [ProfileMenuComponent],
	imports: [IonicPageModule],
})
export class ComponentsModule { }
