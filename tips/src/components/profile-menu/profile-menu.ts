import { Component } from '@angular/core';

@Component({
  selector: 'profile-menu',
  templateUrl: 'profile-menu.html'
})
export class ProfileMenuComponent {

  text: string;

  constructor() {
    console.log('Hello ProfileMenuComponent Component');
    this.text = 'Hello World';
  }

}
