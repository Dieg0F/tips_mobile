
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

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

  createNewAccount(form: NgForm): Promise<any> {
    console.log("criar conta");
    let email = form.value.email;
    let pass = form.value.password;

    return this.afAuth.auth.createUserWithEmailAndPassword(email, pass)
  }

  updateAccount(form: NgForm): Promise<void> {
    console.log("reset de senha");
    return this.afAuth.auth.sendPasswordResetEmail(form.value.email)
  }

  logout(): void { //Sai do sistema
    console.log("sair");
    this.afAuth.auth.signOut();
  }
}
