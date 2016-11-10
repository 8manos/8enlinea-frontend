import { Component } from '@angular/core';
import { AlertController, NavController, ActionSheetController } from 'ionic-angular';
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
  public buttons:Array<Object>;
  public socketHost:String;
  private zone; 
  private socket;
  
  constructor( public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public alertCtrl: AlertController, public http: Http) {

        this.messages = [];
        this.buttons = [
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         }
       ];

        this.socketHost = "http://ochoenlinea-backend.herokuapp.com/";

        this.zone = new NgZone({ enableLongStackTrace: false });

        http.get(this.socketHost + "/").subscribe((success) => {
            var data = success.json();
            for(var i = 0; i < data.length; i++) {
                this.messages.push(data[i].message);
            }
        }, (error) => {
            console.log(JSON.stringify(error));
        });

        this.messages.push( "¡Hola!" );
        this.socket = io.sails.connect( this.socketHost );

        this.socket.on("connect", function(){
          console.log("connected");
        });

        this.socket.get('/intro', null, function (resData) {
          console.log( resData ); 
        });

        this.socket.on("message", (msg) => {
            this.zone.run(() => {
                console.log ("Recibimos: ", msg)
                this.messages.push(msg.plantilla.mensaje);
                for (var i = 0; i < msg.plantilla.respuestas.length; ++i) {
                  var destino = msg.plantilla.respuestas[i].destino;
                  this.buttons.push({
                    text: msg.plantilla.respuestas[i].texto,
                    handler: () => {
                      this.socket.get('/plantilla/4', null, (resData) => {
                        this.zone.run(() => { 
                           console.log( resData ); 
                           console.log( "Mensajes ", this.messages );
                           this.messages.push( resData.mensaje );

                          })} ); 
                    }
                  });
                }
                console.log('Buttons updated', this.buttons );
            });
        });

  }

  presentOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Responder',
      buttons: this.buttons
    });

    actionSheet.present();
  }
}