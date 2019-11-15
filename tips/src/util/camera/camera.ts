import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class CameraProvider {

    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 1000,
        targetHeight: 1000,
        allowEdit: true,
        correctOrientation: true,
    };

    constructor(private camera: Camera) { }

    /**
     * @description request picures from device gallery.
     */
    public async getPicture(source): Promise<any> {
        if (source === 'CAMERA_SOURCE') {
            this.options.sourceType = this.camera.PictureSourceType.CAMERA;
        } else {
            this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        }

        return this.camera.getPicture(this.options);
    }
}
