import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Content, NavController, ActionSheetController } from 'ionic-angular';
import {Http} from "@angular/http";
import {NgZone} from "@angular/core";
import { ioService } from '../../services/io.service'
declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [ioService]
})

export class HomePage implements OnInit {
  
  public messages:Array<Object>;
  public buttons:Array<Object>;
  public socketHost:String;
  @ViewChild(Content) content: Content;
  private zone; 
  private socket;
  
  constructor( 
    private _ioService: ioService, 
    public actionSheetCtrl: ActionSheetController, 
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public http: Http
  ) {
  
        this._ioService.getIntro();

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


        this.zone = new NgZone({ enableLongStackTrace: false });

        this.messages.push( "¡Hola!" );

  }

  ngOnInit(): void {
      //register to the observable
      this._ioService.ioMessage$
          .subscribe( message => {
              console.log( "iOservice message in home: ", message );
              this.displayMessage( message );
          });
  }

  presentOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Responder',
      buttons: this.buttons
    });

    actionSheet.present();
  }

  displayMessage( message ){
    this.zone.run(() => {
      this.messages.push( message["plantilla"].mensaje );
      this.buttons = [
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         }
       ];
      for (var i = 0; i < message["plantilla"].respuestas.length; ++i) {
        var respuesta = message["plantilla"].respuestas[i];
        this.buttons.push({
          text: message["plantilla"].respuestas[i].texto,
          handler: () => {
            this.enviarRespuesta( respuesta );
          }
        });
      }
      console.log('Buttons updated', this.buttons );
      setTimeout(() => {
        this.content.scrollToBottom(300);
      });
    });
  }

  enviarRespuesta( respuesta ){
    console.log('Enviando respuesta desde home.ts: ', respuesta );
    this.messages.push( respuesta.texto );
    this._ioService.sendResponse( respuesta.destino );
  }
}