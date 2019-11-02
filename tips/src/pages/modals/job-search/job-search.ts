import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Job } from '../../../model/job/job';
import { JobProvider } from '../../../providers/job/job';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-job-search',
  templateUrl: 'job-search.html',
})
export class JobSearchPage {

  public searchQuery: string = '';
  public sectors: Job[] = [];
  public sectorsFiltered: Job[] = [];
  public sectorSelected: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public jobProvider: JobProvider,
    public navParams: NavParams,
    public events: Events) {
    this.getJobs();
    this.sectorsFiltered = this.sectors;
  }

  /**
   * @description recovery a job list from params.
   */
  public getJobs() {
    this.sectors = this.navParams.get('jobList');
  }

  /**
   * @description filter all jobs by user typed on search field.
   * @param ev event from select filter.
   */
  public getItems(ev: any) {
    this.sectorsFiltered = this.sectors;
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.sectorsFiltered = this.sectorsFiltered.filter((sector) => {
        return (sector.sectorName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  /**
   * @description close this modal and emit selected job event.
   */
  public finish() {
    this.events.publish('jobSelected', this.sectorSelected);
    this.viewCtrl.dismiss();
  }

  /**
   * @description close this modal and emit empty job event.
   */
  public cancel() {
    this.events.publish('jobSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
