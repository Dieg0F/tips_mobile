import { Component, Input } from '@angular/core';

@Component({
  selector: 'solicitation-photo',
  templateUrl: 'solicitation-photo.html'
})
export class SolicitationPhotoComponent {

  @Input('hiredPhoto') public hiredPhoto: string;
  @Input('contractorPhoto') public contractorPhoto: string;

  constructor() { }
}
