import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Sector } from '../../../model/sector/sector';
import { SectorProvider } from '../../../providers/sector/sector';
import { Loading } from '../../../util/loading/loading';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-job-search',
  templateUrl: 'job-search.html',
})
export class JobSearchPage {

  public searchQuery: string = '';
  public sectors: Array<Sector> = [];
  public sectorsFiltered: Array<Sector> = [];
  public sectorSelected: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public sectorsProvider: SectorProvider,
    public navParams: NavParams,
    public events: Events) {
    this.getSectors();
    this.sectorsFiltered = this.sectors;
  }

  getSectors() {
    this.sectors = this.navParams.get("jobList");
  }

  getItems(ev: any) {
    // Reset items back to all of the items    
    this.sectorsFiltered = this.sectors;
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.sectorsFiltered = this.sectorsFiltered.filter((sector) => {
        return (sector.sectorName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  finish() {
    this.events.publish('jobSelected', this.sectorSelected);
    this.viewCtrl.dismiss();
  }

  cancel() {
    this.events.publish('jobSelected', undefined);
    this.viewCtrl.dismiss();
  }
}
