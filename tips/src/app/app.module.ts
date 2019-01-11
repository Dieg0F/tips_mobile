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

const config = {
  apiKey: "AIzaSyDlOsZfCTUVq4WdVUQReZaQqUb_6UCJWqo",
  authDomain: "tips-36c4a.firebaseapp.com",
  databaseURL: "https://tips-36c4a.firebaseio.com",
  projectId: "tips-36c4a",
  storageBucket: "tips-36c4a.appspot.com",
  messagingSenderId: "1068679955578"};

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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider
  ]
})
export class AppModule {}
