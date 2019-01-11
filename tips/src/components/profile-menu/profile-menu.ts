import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent {

  text: string;

  constructor(public afAuth: AuthProvider, public navCtrl: NavController) {
    console.log('Hello ProfileMenuComponent Component');
    this.text = 'Hello World';
  }

  logout(): void {
    this.afAuth.logout();
  }

  editProfile(): void {
    console.log('Editar perfil');
    this.navCtrl.push("EditProfilePage");
  }
}
