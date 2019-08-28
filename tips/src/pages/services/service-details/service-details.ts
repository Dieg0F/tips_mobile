import { Alert } from './../../../util/alert/alert';
import { Popover } from './../../../util/popover/popover';
import { ProfileProvider } from './../../../providers/profile/profile';
import { Loading } from './../../../util/loading/loading';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Service } from '../../../model/service/service';
import { Profile } from '../../../model/profile/profile';
import { AppConfig } from '../../../model/static/static';
import { Constants } from '../../../util/constants/constants';
import { ServiceProvider } from '../../../providers/service/service';
import { Toast } from '../../../util/toast/toast';

@IonicPage()
@Component({
  selector: 'page-service-details',
  templateUrl: 'service-details.html',
})
export class ServiceDetailsPage {

  public service: Service;
  public contractorProfile: Profile;
  public hiredProfile: Profile;
  public userUid = AppConfig.USER_PROFILE.uid;

  public btnActionText = "";
  public btnActionFunction: Function;

  public serviceStatusClass: string = "";
  public serviceStatus: string = "";

  public showServiceActions: boolean = false;

  public loadingMessage = "";
  public toastMessage = "";

  public count = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loading: Loading,
    public popover: Popover,
    public alert: Alert,
    public toast: Toast,
    public events: Events,
    public serviceProvider: ServiceProvider,
    public profileProvider: ProfileProvider) { }

  ionViewWillEnter() {
    this.getService();
  }

  async getService() {
    this.service = this.navParams.get(Constants.SERVICE_DETAILS);

    var profileUidToRequest = "";

    if (this.service.contractorUid == this.userUid) {
      this.contractorProfile = { ...AppConfig.USER_PROFILE }
      profileUidToRequest = this.service.hiredUid
    } else {
      this.hiredProfile = { ...AppConfig.USER_PROFILE }
      profileUidToRequest = this.service.contractorUid
    }

    this.profileProvider.getProfile(profileUidToRequest)
      .then((res) => {
        if (this.contractorProfile == undefined || this.contractorProfile == null) {
          this.contractorProfile = res.data();
        } else {
          this.hiredProfile = res.data();
        }
        this.buildServiceStatusMessage(this.service.status);
        this.setServiceStatusClass();
      })

    await this.events.subscribe('service:updated', async (serv: Service) => {
      if (this.service.status == Constants.SERVICE_IS_REMOVED) {
        this.navCtrl.popTo("UserServicesPage");
      }

      if (this.count < 1) {
        this.count++;
        this.service = serv;
        this.buildServiceStatusMessage(this.service.status);
        this.setServiceStatusClass();

        if (this.service.status == Constants.SERVICE_IS_AWAIT_TO_FINISH &&
          this.service.lastActionByUserUid == this.userUid) {
          await this.alert.confirmAlert(
            "Avaliar este serviço!",
            "Dê a sua opnião sobre este serviço, ajudando outros usuários do Tips!",
            this.avaliation.bind(this),
            () => { },
            "Depois",
            "AValiar"
          )
        }
      }
    });
  }

  buildServiceStatusMessage(status: string) {
    switch (status) {
      case Constants.SERVICE_IS_OPEN:
        if (this.service.lastActionByUserUid != this.userUid) {
          this.serviceStatus = "Você ainda não aprovou este serviço!";
          this.btnActionText = "Aprovar";
          this.btnActionFunction = this.acceptServiceAction.bind(this);
          this.showServiceActions = true;
        } else {
          this.serviceStatus = "Aguardando aprovação do contratado!";
          this.showServiceActions = false;
        }
        break;
      case Constants.SERVICE_IS_AWAIT_TO_CANCEL:
        if (this.service.lastActionByUserUid != this.userUid) {
          this.serviceStatus = "O contratado cancelou este serviço!";
          this.btnActionText = "Cancelar";
          this.btnActionFunction = this.cancelServiceAction.bind(this);
          this.showServiceActions = true;
        } else {
          this.serviceStatus = "Você cancelou este serviço!";
          this.showServiceActions = false;
        }
        break;
      case Constants.SERVICE_IS_AWAIT_TO_FINISH:
        if (this.service.lastActionByUserUid != this.userUid) {
          this.serviceStatus = "O contratado finalizou este serviço!";
          this.btnActionText = "Finalizar";
          this.btnActionFunction = this.finishContratcAction.bind(this);
          this.showServiceActions = true;
        } else {
          this.serviceStatus = "Você finalizou este serviço!";
          this.showServiceActions = false;
        }
        break;
      case Constants.SERVICE_IS_RUNNING:
        this.serviceStatus = "Serviço em andamento!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showServiceActions = false;
        break;
      case Constants.SERVICE_IS_FINISHED:
        this.serviceStatus = "Serviço finalizado!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showServiceActions = false;
        break;
      case Constants.SERVICE_IS_CANCELED:
        this.serviceStatus = "Serviço cancelado!";
        this.btnActionText = "";
        this.btnActionFunction = null;
        this.showServiceActions = false;
        break;
    }
  }

  openOptions(event) {
    this.popover.showPopover("ServiceOptionsPage", { 'service': this.service }, event)
  }

  setServiceStatusClass() {
    var statusClass = " "

    switch (this.service.status) {
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

    this.serviceStatusClass = statusClass;
  }

  setStatusValueToShow(status): string {
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

  cancelServiceAction() {
    this.alert.confirmAlert(
      "Cancelamento de serviço!",
      "O Contratante cancelou este serviço! Você confirma o cancelamento?",
      () => { this.cancelService() },
      () => { },
      "Não",
      "Sim"
    )
  }

  finishContratcAction() {
    this.alert.confirmAlert(
      "Finalizar serviço!",
      "O Contratante finalizou este serviço! Você confirma o termino do serviço?",
      () => { this.finishService() },
      () => { },
      "Não",
      "Sim"
    )
  }

  acceptServiceAction() {
    this.alert.confirmAlert(
      "Aceitar serviço!",
      "Deseja aceitar este serviço?",
      () => { this.acceptService() },
      () => { },
      "Não",
      "Sim"
    )
  }

  finishService() {
    this.service.status = Constants.SERVICE_IS_FINISHED;
    this.loadingMessage = "Finalizando serviço...";
    this.toastMessage = "Serviço finalizado!";
    this.updateService();
  }

  cancelService() {
    this.service.status = Constants.SERVICE_IS_CANCELED;
    this.loadingMessage = "Cancelando serviço...";
    this.toastMessage = "";
    this.updateService();
  }

  acceptService() {
    this.service.status = Constants.SERVICE_IS_RUNNING
    this.loadingMessage = "Aceitando serviço...";
    this.toastMessage = "Serviço aceito!";
    this.updateService();
  }

  updateService() {
    this.loading.showLoading("Atualizando serviço...")
      .then(() => {
        this.serviceProvider.updateServiceAction(this.service, this.userUid)
          .then(() => {
            this.loading.hideLoading();
            this.toast.showToast(this.toastMessage);
            this.setServiceStatusClass();
            this.buildServiceStatusMessage(this.service.status);
          })
          .catch(() => {
            this.toast.showToast("Erro ao alterar serviço!");
          })
      })
  }

  avaliation() {
    this.navCtrl.push("NewAvaliationPage", { 'service': this.service });
  }
}
