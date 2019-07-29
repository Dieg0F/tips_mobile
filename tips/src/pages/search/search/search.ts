import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public cidade = "";
  public estado = "";
  public areaAtuacao = "";
  public setor = "";
  public rating = 0;
  public profileName = "";


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public profileProvider: ProfileProvider) {
  }

  createFilter() {
    let filter = {
      cidade: this.cidade,
      estado: this.estado,
      areaAtuacao: this.areaAtuacao,
      setor: this.setor,
      userRate: parseInt(this.rating.toString()),
      nome: this.profileName
    }

    this.getProfiles(filter)
  }

  getProfiles(filter: any) {
    var profiles = []

    this.profileProvider.getProfiles(filter).then((res) => {
      res.subscribe((values) => {
        profiles = values

        console.log(profiles)
        // this.navParams.data('profiles', profiles)
        // this.navCtrl.push("ResultsPage")
      })
    })
  }

}
