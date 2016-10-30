import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import {Http} from "@angular/http";
import {NgZone} from "@angular/core";
import * as io from "socket.io-client";


@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {

  public messages:Array<Object>;
  public socketHost:String;
  private zone; 
  private socket;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: Http) {
        this.messages = [];
        this.socketHost = "http://ochoenlinea-backend.herokuapp.com";
        this.zone = new NgZone({enableLongStackTrace: false});
        http.get(this.socketHost + "/fetch").subscribe((success) => {
            var data = success.json();
            for(var i = 0; i < data.length; i++) {
                this.messages.push(data[i].message);
            }
        }, (error) => {
            console.log(JSON.stringify(error));
        });
        this.messages.push( "test message" );
        this.socket = io(this.socketHost);
        this.socket.on("connect", function(){
          console.log("connected");
        });
        this.socket.on("chat_message", (msg) => {
            this.zone.run(() => {
                this.messages.push(msg);
            });
        });
 
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
