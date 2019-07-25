import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Observable } from 'rxjs';
import { Profile } from '../../../model/profile/profile';


@IonicPage()
@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  profiles$: Observable<Profile[]>

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider) {

    this.profileProvider.getProfiles()
      .then((res) => {
        this.profiles$ = res
      });
  }

}
