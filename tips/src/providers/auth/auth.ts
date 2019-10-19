
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';

import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  /**
   * @description make a authentication by e-mail and password.
   * @param form all values from login form.
   */
  public login(form: NgForm): Promise<any> {
    return firebase.auth()
      .signInWithEmailAndPassword(form.value.email, form.value.password);
  }

  /**
   * @description call firebase google authentication.
   */
  public googleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  /**
   * @description call firebase facebook authentication.
   */
  public facebookLogin(): Promise<any> {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  /**
   * @description create a new account for new user.
   * @param email user e-mail.
   * @param pass user pass.
   */
  public createNewAccount(email: string, pass: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass);
  }

  /**
   * @description send a e-mail for user to reset his password.
   * @param email e-mail that will receive password update e-mail.
   */
  public resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  /**
   * @description logout user from firebase and application.
   */
  public logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }
}
