import { Component } from '@angular/core';
import { Events, IonicPage, NavParams, ViewController } from 'ionic-angular';
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
  public jobs: Job[] = [];
  public jobsFiltered: Job[] = [];
  public jobSelected: string;

  constructor(
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public jobProvider: JobProvider,
    public navParams: NavParams,
    public events: Events) {
    this.getJobs();
  }

  /**
   * @description request all jobs from database.
   */
  public getJobs() {
    this.loading.showLoading('Carregando...');
    this.jobs = new Array<Job>();
    this.jobProvider.getJobs()
      .then((res) => {
        res.subscribe((values) => {
          this.jobs = values;
          this.jobsFiltered = this.jobs;
          this.loading.hideLoading();
        });
      })
      .catch((err) => {
        this.toast.showToast('Erro ao buscar lista de profissões!');
      });
  }

  /**
   * @description filter all jobs by user typed on search field.
   * @param ev event from select filter.
   */
  public getItems(ev: any) {
    this.jobsFiltered = this.jobs;
    const val = ev.target.value;

    if (val && val.trim() !== '') {
      this.jobsFiltered = this.jobsFiltered.filter((job) => {
        return (job.sectorName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  /**
   * @description close this modal and emit selected job event.
   */
  public finish() {
    this.events.publish('jobSelected', this.jobSelected);
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
