import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import {Http} from "@angular/http";
import {NgZone} from "@angular/core";
declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

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
        this.socketHost = "https://ochoenlinea-backend.herokuapp.com";
        this.zone = new NgZone({enableLongStackTrace: false});
        http.get(this.socketHost + "/").subscribe((success) => {
            var data = success.json();
            console.log( "response: ", data );
            for(var i = 0; i < data.length; i++) {
                this.messages.push(data[i].message);
            }
        }, (error) => {
            console.log(JSON.stringify(error));
        });
        this.messages.push( "¡Hola!" );
        this.messages.push( "Bienvenido a 8enlinea" );
        this.socket = io.sails.connect( this.socketHost );

        this.socket.on("connect", function(){
          console.log("connected");
        });

        this.socket.get('/intro', null, function (resData) {
          console.log( resData ); 
        });

        this.socket.on("message", (msg) => {
            this.zone.run(() => {
                this.messages.push(msg.greeting);
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
