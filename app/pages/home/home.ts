import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

  }

  doPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Mucho gusto',
      message: "Escribe tu nombre y así te llamaremos de ahora en adelante",
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre Completo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
}
