import { Constants } from './../../../util/constants/constants';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../../providers/service/service';
import { Service } from '../../../model/service/service';
import { AppConfig } from '../../../model/static/static';

@IonicPage()
@Component({
  selector: 'page-user-services',
  templateUrl: 'user-services.html',
})
export class UserServicesPage {

  public services: Array<Service> = new Array<Service>();
  public allServices: Array<Service> = new Array<Service>();

  public userId = AppConfig.USER_PROFILE.uid;

  public serviceType = Constants.ALL_SERVICES;

  public requestingServices = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: Toast,
    public loading: Loading,
    public profileProvider: ProfileProvider,
    public serviceProvider: ServiceProvider) {
    this.getServices()
  }

  ionViewWillEnter() {
    this.onFilterChange();
  }

  getServices() {
    this.services = new Array<Service>();
    this.allServices = new Array<Service>();
    this.loading.showLoading("Buscando serviços...")
      .then(() => {
        this.serviceProvider.getServices(this.userId)
          .then((res) => {
            res.subscribe((values) => {
              this.allServices = values;
              this.services = values;
              this.onSuccess();
            })
          })
          .catch((err) => {
            console.log(err);
            this.onError();
          })
      })
  }

  private onSuccess() {
    this.requestingServices = false
    this.loading.hideLoading();
    if (this.services.length > 1) {
      this.toast.showToast("Exibindo " + this.services.length.toString() + " serviços!");
    }
  }

  private onError() {
    this.loading.hideLoading();
    this.toast.showToast("Erro ao buscar serviços!");
  }

  goToDetails(service: any) {
    this.navCtrl.push('ServiceDetailsPage', { 'service': service })
  }

  onFilterChange() {
    this.requestingServices = true
    this.services = new Array<Service>()
    switch (this.serviceType) {
      case Constants.ALL_SERVICES:
        this.getAllServices();
        break;
      case Constants.SERVICES_RECEIVED:
        this.getReceivedServices();
        break;
      case Constants.SERVICES_DONE:
        this.getDoneServices();
        break;
      default:
        this.getServicesByStatus(this.serviceType);
        break;
    }
  }

  private getReceivedServices() {
    this.allServices.forEach(el => {
      if (el.hiredUid == this.userId) {
        this.services.push(el);
      }
    })
    this.requestingServices = false
  }

  private getDoneServices() {
    this.allServices.forEach(el => {
      if (el.contractorUid == this.userId) {
        this.services.push(el);
      }
    })
    this.requestingServices = false
  }

  private getAllServices() {
    this.services = this.allServices;
    this.requestingServices = false
  }

  private getServicesByStatus(status: string) {
    this.allServices.forEach(el => {
      if (el.status == status) {
        this.services.push(el);
      }
    })
    this.requestingServices = false
  }

  setServiceStatusClass(status): String {
    var statusClass = " "

    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        statusClass += "newService";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusClass += "runningService";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusClass += "finishedService";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusClass += "canceledService";
        break;
      case Constants.SERVICE_IS_AWAIT_TO_FINISH:
        statusClass += "finishedService";
        break;
      case Constants.SERVICE_IS_AWAIT_TO_CANCEL:
        statusClass += "canceledService";
        break;
      case Constants.SERVICE_IS_REMOVED:
        statusClass += "removedService";
        break;
    }

    return statusClass;
  }

  setStatusValueToShow(status): String {
    var statusValue = ""

    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        statusValue += "Novo";
        break;
      case Constants.SERVICE_IS_RUNNING:
        statusValue += "Em Andamento";
        break;
      case Constants.SERVICE_IS_FINISHED:
        statusValue += "Finalizado";
        break;
      case Constants.SERVICE_IS_CANCELED:
        statusValue += "Cancelado";
        break;
      case Constants.SERVICE_IS_AWAIT_TO_FINISH:
        statusValue += "Finalizando";
        break;
      case Constants.SERVICE_IS_AWAIT_TO_CANCEL:
        statusValue += "Cancelando";
        break;
      case Constants.SERVICE_IS_REMOVED:
        statusValue += "Removido";
        break;
    }

    return statusValue;
  }
}