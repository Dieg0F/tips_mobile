import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';

declare var google;

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  public profile: any;
  public map: any;

  private directionsService = new google.maps.DirectionsService();
  private directionsDisplay = new google.maps.DirectionsRenderer();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.getProfile();
  }

  getProfile() {
    this.profile = this.navParams.get(Constants.CONTACT_PROFILE)
    console.log(this.profile)
  }

  ionViewDidLoad() {
    this.buildMap()
  }

  buildMap() {
    const position = new google.maps.LatLng(-22.2477317, -45.9757412);

    const mapOptions = {
      zoom: 15,
      center: position,
      disableDefaultUI: true
    }

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const marker = new google.maps.Marker({
      position: position,
      map: this.map,

      //Titulo
      title: 'Minha posição',

      //Animção
      animation: google.maps.Animation.DROP, // BOUNCE
    });
  }

  route() {

    const request = {
      origin: new google.maps.LatLng(-22.2477317, -45.9757412),
      destination: new google.maps.LatLng(-22.2575207, -45.6968707),
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.IMPERIAL
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var showdirections = new google.maps.DirectionsRenderer(map)

    var mapOptions = {
      zoom: 1,
      center: "Brazil",
      disableDefaultUI: true
    }

    this.directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        console.log("Success!!")
        showdirections.setDirections(result);
      }
    });
  }
}
