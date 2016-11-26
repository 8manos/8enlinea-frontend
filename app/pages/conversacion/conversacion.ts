import { Component, OnInit, NgZone } from '@angular/core';
import { Nav, NavController, NavParams,  MenuController, ActionSheetController } from 'ionic-angular';
import { Conversacion } from '../../models/Conversacion';
import { Http } from "@angular/http";
import { ioService } from '../../services/io.service';
import { ChatPage } from '../chat/chat';
import { DetallesPage } from '../detalles/detalles';
import { MultimediaPipe } from '../../pipes/multimedia.pipe';

@Component({
  templateUrl: 'build/pages/conversacion/conversacion.html',
  pipes: [MultimediaPipe]
})

export class ConversacionPage implements OnInit {
  public conversacion:any;
  public conversaciones:any;
  public conversacion_requested:any;
  public buttons:Array<any>;
  private _ioServiceMessages: Array<{}>;
  private zone;

  constructor(
  	private _ioService: ioService,      
  	private menu: MenuController, 
  	private navCtrl: NavController, 
  	private navParams: NavParams,
    public actionSheetCtrl: ActionSheetController ) {
  		this.conversacion_requested = navParams.get("conversacion");
      this.conversacion = this.conversacion_requested;
      this.zone = new NgZone({ enableLongStackTrace: false });
      this._ioService.getConversacion( this.conversacion_requested.id );
      this.buttons = [
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         }
       ];
  	}

  ngOnInit(): void {
      this._ioService.getConversaciones();

      this._ioService.conversacion.subscribe(
        resData => {
          console.log( "Conversacion Subscribed: ", resData );
          this.showConversacion( resData );
        }
      );

      //register to the ioMesage observable
      this._ioService.ioMessage$
          .subscribe( message => {
              console.log( "iOservice message in conversacion: ", message );
          });

      this._ioService.conversaciones.subscribe(
        resData => {
          console.log( "ResData Subscribed: ", resData );
          this.conversaciones = resData;
        }
      );
  }

  showConversacion( conversacion ){
    if( !conversacion.id ){ 
        console.log( "La conversación solicitada aún no está definida." );
    }else{   
      this.zone.run(() => {
        this.conversacion = conversacion;
        console.log('Scope conversación: ', this.conversacion );
        this.subscribe( this.conversacion.id );
        if( this.conversacion.mensajes.length == 0 ){
          console.log( "La conversación solicitada aún no tiene mensajes." );
          if (typeof this.conversacion.mensaje_inicial != 'undefined'){
            console.log("Se ha solicitado un mensaje inicial vacio");
          }else{
            this.agregarMensaje( this.conversacion.mensaje_inicial );
          }
        }  
        this.buttons = [
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () => {
             console.log('Cancel clicked');
           }
         }
        ];  

        for (var i = 0; i < conversacion.respuestas.length; ++i) {
          let respuesta = conversacion.respuestas[i];
          this.buttons.push({
            text: conversacion.respuestas[i].texto,
            handler: () => {
              this.enviarRespuesta( respuesta );
            }
          });
        } 

      });
    }
  }

  agregarMensaje( plantilla ){
    console.log( "Generando primer mensaje a partir de plantilla: ", plantilla );
    this._ioService.agregarMensaje( plantilla, this.conversacion.id );
  }

  enviarRespuesta( respuesta ){
    console.log('Enviando respuesta desde conversacion.ts: ', respuesta );
    // this._ioService.sendResponse( respuesta.destino );
  }

  load_conversacion( conversacion ){
    console.log( 'Loading conversacion: ', conversacion );
    this.navCtrl.push( ConversacionPage, { conversacion: conversacion } );
    this.menu.close();
  }

  subscribe( id ) {
    console.log("Viendo conversación: "+ id );
    this._ioService.subscribeToConversacion( id );
  }

  ionViewDidEnter() {
    console.log("Retomando conversación: "+ this.conversacion.id );
    this._ioService.subscribeToConversacion( this.conversacion.id );
    this.menu.enable(true, 'menu_conversaciones');
    this.menu.enable(false, 'menu_main');
    this.menu.open();
  }

  ionViewDidLeave() {
    console.log("Abandonando conversación: "+ this.conversacion.id );
    this._ioService.unsubscribeToConversacion( this.conversacion.id );
  }

  verDetalles() {
    console.log("Cargando detalles de conversación: ");
    this.navCtrl.push( DetallesPage, { conversacion: this.conversacion } );
  }

  presentOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Responder',
      buttons: this.buttons
    });

    actionSheet.present();
  }

}
