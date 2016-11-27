import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Nav, NavController, NavParams, Content, MenuController, ActionSheetController } from 'ionic-angular';
import { Conversacion } from '../../models/Conversacion';
import { Http } from "@angular/http";
import { ioService } from '../../services/io.service';
import { ChatPage } from '../chat/chat';
import { DetallesPage } from '../detalles/detalles';
import { MultimediaPipe } from '../../pipes/multimedia.pipe';
import { TimeagoPipe } from '../../pipes/moment.pipe';

@Component({
  templateUrl: 'build/pages/conversacion/conversacion.html',
  pipes: [MultimediaPipe, TimeagoPipe]
})

export class ConversacionPage implements OnInit {
  public interval:any;
  private subscription:any;
  private message_subscription:any;
  private conversaciones_subscription:any;
  public conversacion:any;
  public conversaciones:any;
  public conversacion_requested:any;
  public buttons:Array<any>;
  public styles:Array<any>;
  private _ioServiceMessages: Array<any>;
  private zone;
  public me:any;

  @ViewChild(Content) content: Content;

  constructor(
  	private _ioService: ioService,      
  	private menu: MenuController, 
  	private navCtrl: NavController, 
  	private navParams: NavParams,
    public actionSheetCtrl: ActionSheetController ) {
  		this.conversacion_requested = navParams.get("conversacion");
      this.conversacion = this.conversacion_requested;
      this.me = { id: 0 };
      this.styles = new Array();
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
      this.subscription = this._ioService.conversacion.subscribe(
        resData => {
          console.log( "Conversacion Subscribed: ", resData );
          this.showConversacion( resData );
        }
      );

      //register to the ioMesage observable
      this.message_subscription = this._ioService.ioMessage$
          .subscribe( message => {
              let notice:any = message;
              console.log( "iOservice message in conversacion: ", notice );
              if( notice.accion == 'nuevo_mensaje' ){
                this.traerMensajes();
                this.traerRespuestas();
              }else if( notice.accion == 'nueva_accion' && notice.conversacion == this.conversacion.id ) {
                this.accion( notice.comando );
              }
          });
  }

  traerMe(){
    console.log("Actualizando perfil.");
    this._ioService.loadMe().then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'Loadme promise resolved with data: ', data );
          this.me = data;
        });
      }
    );
  }
 
  traerMensajes(){
    console.log("Actualizando mensajes.");
    this._ioService.loadMessages( this.conversacion.id ).then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'Loadmessages promise resolved with data: ', data );
          this.conversacion.mensajes = data;
          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 100 );
        });
      }
    );
  }

  traerRespuestas(){
    console.log("Actualizando respuestas.");
    this._ioService.loadAnswers( this.conversacion.id ).then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'Loadanswers promise resolved with data: ', data );
          this.conversacion.respuestas = data;
          this.buttons = [
           {
             text: 'Cancelar',
             role: 'cancel',
             handler: () => {
               console.log('Cancel clicked');
             }
           }
          ];  

          for (var i = 0; i < this.conversacion.respuestas.length; ++i) {
            let respuesta = this.conversacion.respuestas[i];
            this.buttons.push({
              text: this.conversacion.respuestas[i].texto,
              handler: () => {
                this.enviarRespuesta( respuesta );
              }
            });
          }
          setTimeout(() => {
            this.content.scrollToBottom(300);
          }, 100 );
        });
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
        setTimeout(() => {
            this.content.scrollToBottom(300);
        }, 100 );
        if( this.conversacion.mensajes.length == 0 ){
          console.log( "La conversación solicitada aún no tiene mensajes." );
          if (typeof this.conversacion.mensaje_inicial != 'undefined'){
            this.agregarMensaje( this.conversacion.mensaje_inicial );
          }else{
            console.log("Se ha solicitado un mensaje inicial vacio: ", this.conversacion );
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
    this._ioService.agregaRespuesta( this.conversacion.id, respuesta );
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
    this.traerMe();
    this.menu.enable(true, 'menu_conversaciones');
    this.menu.enable(false, 'menu_main');
    this.menu.open();

    let that = this;
    this.interval = setInterval(function() {
        this.zone.run( () => { console.log("tick")});
      }, 5000);

  }

  ionViewDidLeave() {
    console.log("Abandonando conversación: "+ this.conversacion.id );
    this._ioService.unsubscribeToConversacion( this.conversacion.id );
    this.subscription.unsubscribe();
    this.message_subscription.unsubscribe();

    clearInterval( this.interval );
    this.interval = null;
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

  accion( accion ){
    if( accion.tipo == "activa_mensaje" ){
      console.log( "Activando mensaje: ", accion.parametro );
      this._ioService.agregarMensaje( accion.parametro, this.conversacion.id );
    }else if( accion.tipo == "cambia_css"){
      console.log( "Cambiando css: ", [ accion.parametro , accion.valor ] );
      this.styles[ accion.parametro ] = accion.valor;
    }else if( accion.tipo == "inicia_conversacion"){
      setTimeout(() => {
        this._ioService.nuevaHistoria( accion.parametro );
        this.navCtrl.pop();
      }, 1111 );
    }else{
      console.log( "Acción pendiente de implementación: ", accion.tipo );
    }

    setTimeout(() => {
      this.content.scrollToBottom(100);
    });
  }

}