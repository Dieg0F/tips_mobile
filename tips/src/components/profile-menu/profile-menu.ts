import { Component } from '@angular/core';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent {

  text: string;

  constructor(public afAuth: AuthProvider) {
    console.log('Hello ProfileMenuComponent Component');
    this.text = 'Hello World';
  }

  logout(): void {
    this.afAuth.logout();
  }
}
