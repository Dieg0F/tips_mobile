import { Directive } from '@angular/core';
import { TextInput } from 'ionic-angular';

const ENTER_CODE = 13;

@Directive({
  host: {
    '(keydown)': 'onInputChange($event)',
  },
  selector: '[next-input]',
})
export class NextInputDirective {

  constructor(private inputRef: TextInput) {

  }

  /**
   * @description If enter is pressed, goes to the next input.
   * @param e the event of clicking.
   */
  public onInputChange(e) {
    const code = e.keyCode || e.which;
    if (code === ENTER_CODE) {
      e.preventDefault();
      this.inputRef.focusNext();
    }
  }
}