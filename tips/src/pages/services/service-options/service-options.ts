import { AvaliationProvider } from './../../../providers/avaliation/avaliation';
import { Alert } from './../../../util/alert/alert';
import { Loading } from './../../../util/loading/loading';
import { Toast } from './../../../util/toast/toast';
import { ServiceProvider } from './../../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Constants } from '../../../util/constants/constants';
import { AppConfig } from '../../../model/static/static';
import { Service } from '../../../model/service/service';
import { Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-service-options',
  templateUrl: 'service-options.html',
})
export class ServiceOptionsPage {

  public service: Service;

  public serviceFinishedStatus = Constants.SERVICE_IS_FINISHED
  public userUid = AppConfig.USER_PROFILE.uid

  public loadingMessage = ""
  public toastMessage = ""

  public removeAction: boolean = false;
  public cancelAction: boolean = false;
  public finishAction: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toast: Toast,
    public loading: Loading,
    public alert: Alert,
    public events: Events,
    public serviceProvider: ServiceProvider,
    public avaliationProvider: AvaliationProvider) {
    this.service = this.navParams.get(Constants.SERVICE_DETAILS);
  }

  ionViewWillEnter() {
    this.service = this.navParams.get(Constants.SERVICE_DETAILS);
    this.setButtons();
  }

  setButtons() {
    if (this.service.status == Constants.SERVICE_IS_FINISHED ||
      this.service.status == Constants.SERVICE_IS_CANCELED ||
      this.service.status == Constants.SERVICE_IS_AWAIT_TO_CANCEL ||
      this.service.status == Constants.SERVICE_IS_AWAIT_TO_FINISH) {
      this.removeAction = true;
      this.cancelAction = false;
      this.finishAction = false;
    }

    if (this.service.status == Constants.SERVICE_IS_RUNNING) {
      this.cancelAction = true;
      this.finishAction = true;
      this.removeAction = false;
    }

    if (this.service.status == Constants.SERVICE_IS_OPEN) {
      this.cancelAction = true;
      this.finishAction = true;
      this.removeAction = false;
    }
  }

  cancelServiceAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Cancelar Serviço",
          "Deseja cancelar este serviço?",
          this.cancelService.bind(this),
          () => { })
      })

  }

  removeServiceAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Remover Serviço",
          "Deseja remover este serviço?",
          this.removeService.bind(this),
          () => { })
      })

  }

  finishServiceAlert() {
    this.close()
      .then(() => {
        this.alert.confirmAlert(
          "Finalizar Serviço",
          "Deseja finalizar este serviço?",
          this.finishService.bind(this),
          () => { })
      })

  }


  finishService() {
    this.service.status = Constants.SERVICE_IS_AWAIT_TO_FINISH;
    this.loadingMessage = "Finalizando serviço...";
    this.toastMessage = "Serviço finalizado!";
    this.updateService();
  }

  cancelService() {
    this.service.status = Constants.SERVICE_IS_AWAIT_TO_CANCEL;
    this.loadingMessage = "Cancelando serviço...";
    this.toastMessage = "Serviço cancelado!";
    this.updateService();
  }

  removeService() {
    this.service.status = Constants.SERVICE_IS_REMOVED;
    this.service.isRemoved = true;
    this.loadingMessage = "Removendo serviço...";
    this.toastMessage = "Serviço removido!";
    this.updateService();
  }

  async updateService() {
    this.service.lastActionByUserUid = this.userUid;
    await this.loading.showLoading(this.loadingMessage)
      .then(async () => {
        if (this.service.status == Constants.SERVICE_IS_REMOVED) {
          await this.serviceProvider.updateService(this.service)
            .then(async () => {
              await this.success();
            })
            .catch(() => {
              this.error();
            })
        } else {
          await this.serviceProvider.updateServiceAction(this.service, this.userUid)
            .then(async () => {
              await this.success();
            })
            .catch(() => {
              this.error();
            })
        }
      })
      .catch((err) => {
        console.log("Error: ServiceOptionsPage, Loading Hide");
        console.log("Error: ", err);
      })
  }

  success() {
    // this.loading.hideLoadingPromise()
    //   .then(async () => {
    //     return this.toast.showToast(this.toastMessage)
    //       .then(async () => {
    //         this.events.publish('service:updated', this.service);
    //       })
    //   })
    //   .catch(() => {
    //     console.log("Error: ServiceOptionsPage, Loading Hide")
    //   })
    try {
      this.loading.hideLoading();
      this.toast.showToast(this.toastMessage);
      this.events.publish('service:updated', this.service);
    } catch (error) {
      console.log("Error: ServiceOptionsPage, Loading Hide");
      console.log("Error: ", error);
    }
  }

  error() {
    this.loading.hideLoadingPromise()
      .then(() => {
        return this.toast.showToast("Erro ao atualizar o status do serviço.");
      })
      .catch(() => {
        console.log("Error: ServiceOptionsPage, Loading Hide")
      })
  }

  close(): Promise<any> {
    return this.viewCtrl.dismiss();
  }
}
