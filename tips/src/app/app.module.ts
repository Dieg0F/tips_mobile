import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { MyApp } from './app.component';

import { ComponentsModule } from '../components/components.module';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { Alert } from '../util/alert/alert';
import { Toast } from '../util/toast/toast';
import { Loading } from '../util/loading/loading';
import { HttpClientModule } from '@angular/common/http';
import { StorageProvider } from '../providers/storage/storage';
import { ProfileProvider } from '../providers/profile/profile';
import { AppConfigProvider } from '../providers/app-config/app-config';
import { FileChooser } from '@ionic-native/file-chooser';
import { Camera } from '@ionic-native/camera';
import { CameraProvider } from '../util/camera/camera';

const config = {
  apiKey: "AIzaSyBUzDf7u-UXxfNLch_ucKZTxo9pfsXgxpc",
  authDomain: "tips-app-418.firebaseapp.com",
  databaseURL: "https://tips-app-418.firebaseio.com",
  projectId: "tips-app-418",
  storageBucket: "tips-app-418.appspot.com",
  messagingSenderId: "896288102091"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,    
    UserProvider,
    ProfileProvider,
    StorageProvider, 
    CameraProvider,
    FileChooser,
    Camera,
    Alert,
    Loading,
    Toast,
    AppConfigProvider
  ]
})
export class AppModule { }
