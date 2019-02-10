import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {

    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 500,
        targetHeight: 500,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }

    constructor(private camera: Camera) { }    

    async getPicture(): Promise<any> {
        return this.camera.getPicture(this.options)
    }

}