
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  //Faz logon no sistema
  login(form: NgForm): Promise<any> {
    console.log("login");
    let email: string = form.value.email;
    let pass: string = form.value.password;

    return this.afAuth.auth.signInWithEmailAndPassword(email, pass)
  }

  googleLogin(): Promise<any> {
    console.log("Google Login");

    var provider = new firebase.auth.GoogleAuthProvider();    
    return firebase.auth().signInWithPopup(provider)
  }

  facebookLogin(): Promise<any> {
    console.log("Facebook Login");

    var provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider)
  }

  createNewAccount(form: NgForm): Promise<any> {
    console.log("criar conta");
    let email = form.value.email;
    let pass = form.value.password;

    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
  }

  resetPassword(form: NgForm): Promise<void> {
    console.log("reset de senha");
    return this.afAuth.auth.sendPasswordResetEmail(form.value.email)
  }

  logout(): Promise<void> { //Sai do sistema
    console.log("sair");
    return this.afAuth.auth.signOut();
  }
}
