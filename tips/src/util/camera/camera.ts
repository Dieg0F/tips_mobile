import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {

    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 250,
        targetHeight: 250,
        allowEdit: true,
        correctOrientation: true,
    };

    constructor(private camera: Camera) { }

    /**
     * @description request picures from device gallery.
     */
    public async getPicture(): Promise<any> {
        return this.camera.getPicture(this.options);
    }
}
