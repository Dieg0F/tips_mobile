import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Profile } from '../../model/profile/profile';
import { Solicitation } from '../../model/solicitation/solicitation';
import { Constants } from '../../util/constants/constants';
import { StarRateHelper } from '../../util/stars-rate/stars-rate';

@Component({
  selector: 'solicitation',
  templateUrl: 'solicitation.html',
})
export class SolicitationComponent {

  @Input('solicitation') public solicitation: Solicitation;
  @Input('profile') public profile: Profile;
  @Output() public onPhotoClick = new EventEmitter<any>();
  @Output() public onProfileClick = new EventEmitter<any>();

  public solicitationDate: string;
  public solicitationClass: string;
  private starsRateHelper: StarRateHelper;

  constructor() {
    this.starsRateHelper = new StarRateHelper();
  }

  public ngOnInit() {
    this.solicitationDate = new Date(this.solicitation.date).toLocaleDateString();
  }

  /**
   * @description set solicitation view class by status.
   */
  public setSolicitationStatusClass(): string {
    let statusClass = ' ';

    switch (this.solicitation.status) {
      case Constants.SOLICITATION_IS_OPEN:
        statusClass += 'newSolicitation';
        break;
      case Constants.SOLICITATION_IS_RUNNING:
        statusClass += 'runningSolicitation';
        break;
      case Constants.SOLICITATION_IS_FINISHED:
        statusClass += 'finishedSolicitation';
        break;
      case Constants.SOLICITATION_IS_CANCELED:
        statusClass += 'canceledSolicitation';
        break;
    }

    this.solicitationClass = statusClass;
    return statusClass;
  }

  /**
   * @description Build a array of string with all stars rate icons.
   * @param value User rate value.
   */
  public starsRate(value: number): string[] {
    return this.starsRateHelper.starsRate(value);
  }

  /**
   * @description Build a string with a specific color by user rate.
   * @param value User rate value.
   */
  public starsRateColor(value: number): string {
    return this.starsRateHelper.starsRateColor(value);
  }

  /**
   * @description throw to parent component a PhotoComponent click event.
   */
  public photoClick() {
    this.onPhotoClick.emit();
  }

  /**
   * @description throw to parent component a Profile Button click event.
   */
  public profileClick() {
    this.onProfileClick.emit();
  }
}
