import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
})
export class ProfilePhotoComponent {

  @Input('photoUrl') public photoUrl: string;
  @Output() public onClick = new EventEmitter<any>();

  constructor() { }

  /**
   * @description Build user avatar image.
   */
  public setAvatarImage() {
    let profilePhoto = '';
    if (this.photoUrl) {
      profilePhoto = this.photoUrl;
    } else {
      profilePhoto = '../../../assets/imgs/user_default_image.png';
    }
    return {
      'background-image': 'url(' + profilePhoto + ')',
      'background-position': 'center',
      'background-size': 'cover',
    };
  }

  public clickAction() {
    this.onClick.emit();
  }
}
