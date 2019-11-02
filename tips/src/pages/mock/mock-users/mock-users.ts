import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JobProvider } from '../../../providers/job/job';
import { MockUsers } from '../../../providers/mock/mock-users';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';
import { ProfileProvider } from '../../../providers/profile/profile';
import { Locations } from '../../../providers/locations/locations';

@IonicPage()
@Component({
  selector: 'page-mock-users',
  templateUrl: 'mock-users.html',
})
export class MockUsersPage {

  private mock: MockUsers;
  private users: any[] = new Array();
  private userToSave: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider,
    public location: Locations,
    public loading: Loading,
    public toast: Toast,
    public jobProvider: JobProvider) {
  }

  public getUsers() {
    this.userToSave = 0;
    this.loading.showLoading('Building List...');
    this.mock = new MockUsers();
    this.users = this.mock.getUsers();

    this.getJobs();
  }

  public toAvaliations() {
    this.navCtrl.push('MockAvalsPage');
  }

  public toSolicitations() {
    this.navCtrl.push('MockSolsPage');
  }

  private getJobs() {
    this.jobProvider.getJobs()
      .then((subs) => {
        subs.subscribe((data) => {
          this.setUsersJobs(data);
        });
      });
  }

  private setUsersJobs(data: any) {
    this.users.forEach((el) => {
      el.job = data[Math.floor(Math.random() * 50) + 1].sectorName;
    });

    this.setUsersLocations();
  }

  private setUsersLocations() {
    const cities = ['Pouso Alegre', 'Itajubá', 'Santa Rita do Sapucaí', 'Congonhal', 'Borda da Mata'];
    this.users.forEach((el) => {
      el.city = cities[Math.floor(Math.random() * 5)];
      el.state = 'MG';
    });

    // tslint:disable-next-line:no-console
    console.log('Users: ', this.users);
    this.saveList();
  }

  private saveList() {
    this.profileProvider.saveProfileMock(this.users[this.userToSave])
      .then(() => {
        this.userToSave++;
        if (this.userToSave < this.users.length) {
          this.saveList();
        } else {
          this.loading.hideLoading();
          this.toast.showToast('List Saved!');
        }
      })
      .catch((err) => {
        this.toast.showToast('Error on save profile n°' + this.userToSave + 1 + '!');
        // tslint:disable-next-line:no-console
        console.log('Error on save profile n°' + this.userToSave + 1 + '!', err);
      });
  }

}
