
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth) { }

  /**
   * @description make a authentication by e-mail and password.
   * @param form all values from login form.
   */
  public login(email: string, password: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password);
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
