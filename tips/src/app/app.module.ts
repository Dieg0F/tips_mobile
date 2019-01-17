import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
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

const config = {
  apiKey: "AIzaSyDXRsRIsmwSqxhOq6DhPygoRFLP0ng5AeQ",
  authDomain: "tips-8112e.firebaseapp.com",
  databaseURL: "https://tips-8112e.firebaseio.com",
  projectId: "tips-8112e",
  storageBucket: "tips-8112e.appspot.com",
  messagingSenderId: "1067203153657"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
    Alert,
    Loading,
    Toast
  ]
})
export class AppModule { }
