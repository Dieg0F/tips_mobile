import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MyApp } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { ComponentsModule } from '../components/components.module';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AuthProvider } from '../providers/auth/auth';
import { AvaliationProvider } from '../providers/avaliation/avaliation';
import { DataProvider } from '../providers/data/data';
import { Locations } from '../providers/locations/locations';
import { ProfileProvider } from '../providers/profile/profile';
import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { Alert } from '../util/alert/alert';
import { CameraProvider } from '../util/camera/camera';
import { HttpService } from '../util/http/http';
import { Loading } from '../util/loading/loading';
import { Toast } from '../util/toast/toast';

import { Geolocation } from '@ionic-native/geolocation';
import { StarRatingModule } from 'ionic3-star-rating';
import { AreaProvider } from '../providers/area/area';
import { SectorProvider } from '../providers/sector/sector';
import { Notifications } from '../util/notifications/notifications';
import { Popover } from '../util/popover/popover';

import { FCM } from '@ionic-native/fcm';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { SolicitationProvider } from '../providers/solicitations/solicitations';

const config = {
  apiKey: 'AIzaSyBUzDf7u-UXxfNLch_ucKZTxo9pfsXgxpc',
  authDomain: 'tips-app-418.firebaseapp.com',
  databaseURL: 'https://tips-app-418.firebaseio.com',
  messagingSenderId: '896288102091',
  projectId: 'tips-app-418',
  storageBucket: 'tips-app-418.appspot.com',
};

@NgModule({
  bootstrap: [IonicApp],
  declarations: [
    MyApp,
  ],
  entryComponents: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb'],
      name: '_userData',
    }),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    StarRatingModule,
    BrMaskerModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    AvaliationProvider,
    UserProvider,
    ProfileProvider,
    StorageProvider,
    CameraProvider,
    SolicitationProvider,
    SectorProvider,
    AreaProvider,
    DataProvider,
    HttpService,
    FileChooser,
    Geolocation,
    Notifications,
    Camera,
    Alert,
    Loading,
    Toast,
    Locations,
    Popover,
    AppConfigProvider,
    FCM,
  ],
})
export class AppModule { }
