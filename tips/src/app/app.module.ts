import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Camera } from '@ionic-native/camera';
import { FCM } from '@ionic-native/fcm';
import { FileChooser } from '@ionic-native/file-chooser';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StarRatingModule } from 'ionic3-star-rating';
import { ComponentsModule } from '../components/components.module';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { AuthProvider } from '../providers/auth/auth';
import { AvaliationProvider } from '../providers/avaliation/avaliation';
import { DataProvider } from '../providers/data/data';
import { ExternalAppProvider } from '../providers/external-app/external-app';
import { JobProvider } from '../providers/job/job';
import { Locations } from '../providers/locations/locations';
import { ProfileProvider } from '../providers/profile/profile';
import { SolicitationProvider } from '../providers/solicitations/solicitations';
import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { Alert } from '../util/alert/alert';
import { CameraProvider } from '../util/camera/camera';
import { HttpService } from '../util/http/http';
import { Loading } from '../util/loading/loading';
import { Notifications } from '../util/notifications/notifications';
import { Popover } from '../util/popover/popover';
import { Toast } from '../util/toast/toast';
import { MyApp } from './app.component';

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
    IonicModule.forRoot(MyApp, {
      pageTransition: 'md-transition',
      platforms: {
        android: {
          autoFocusAssist: false,
          scrollAssist: true,
          scrollPadding: false,
        },
      }
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['indexeddb'],
      name: '_userData',
    }),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule.enablePersistence({ experimentalTabSynchronization: true }),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
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
    JobProvider,
    DataProvider,
    ExternalAppProvider,
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
    AppAvailability,
    InAppBrowser,
    FCM,
  ],
})
export class AppModule { }
