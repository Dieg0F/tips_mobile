
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertController } from 'ionic-angular';


@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private alertCtrl: AlertController) { }

  //Faz logon no sistema
  login(form: NgForm) {
    let email: string = form.value.email;
    let pass: string = form.value.password;

    this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .catch((_error) => {
        this.showMessage(_error.message)
      })
  }

  createNewAccount(form: NgForm): void {
    //captura os dados do form
    let name = form.value.name;
    let email = form.value.email;
    let pass = form.value.password;
    let confimPass = form.value.confirmPass;
    this.afAuth.auth.createUserWithEmailAndPassword(email, pass)//cria um usuário valido
      .then((result) => {
        let newUser = { //cria um novo usuário
          uid: result.user.uid,
          name: name,
          email: email,
          confimPass: confimPass
        }
        this.db.collection('users').doc(newUser.uid).set(newUser);//salva o novo usuário
      })
      .catch((error) => {
        this.showMessage(error.message);
      })
  }

  updateAccount(form: NgForm): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(form.value.email)
  }

  logout(): void { //Sai do sistema
    console.log("sair");
    this.afAuth.auth.signOut();
  }

  private showMessage(text: string): void {
    let alert = this.alertCtrl.create({
      title: 'Falha no login!',
      subTitle: text,
      buttons: ['Ok']
    });
    alert.present();
  }
   
}
