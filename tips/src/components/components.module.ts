import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactsComponent } from './contacts/contacts';
import { ProfileMenuComponent } from './profile-menu/profile-menu';
import { SolicitationComponent } from './solicitation/solicitation';
import { ProfilePhotoComponent } from './profile-photo/profile-photo';
import { SolicitationPhotoComponent } from './solicitation-photo/solicitation-photo';

@NgModule({
    declarations: [ProfileMenuComponent,
        ContactsComponent,
        SolicitationComponent,
    ProfilePhotoComponent,
    SolicitationPhotoComponent],
    exports: [ProfileMenuComponent,
        ContactsComponent,
        SolicitationComponent,
    ProfilePhotoComponent,
    SolicitationPhotoComponent],
    imports: [IonicPageModule],
})
export class ComponentsModule { }
