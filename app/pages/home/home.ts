import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Content, NavController, ActionSheetController, ModalController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { Mensaje } from '../../directives/mensaje.directive';
import { KeysPipe } from '../../pipes/keys.pipe';
import { MultimediaPipe } from '../../pipes/multimedia.pipe';
import { Http } from "@angular/http";
import { NgZone } from "@angular/core";
import { ioService } from '../../services/io.service';
import { ToastService } from '../../services/toast.service';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'build/pages/home/home.html',
  pipes: [MultimediaPipe, KeysPipe]
})

export class HomePage implements OnInit {
  
  public tab1Root: any;
  public messages:Array<any>;
  public styles:Array<any>;
  public buttons:Array<Object>;
  public socketHost:String;
  @ViewChild(Content) content: Content;
  private zone; 
  private socket;
  
  constructor( 
    private toastService: ToastService,
    private _ioService: ioService, 
    public actionSheetCtrl: ActionSheetController, 
    public navCtrl: NavController, 
    public alertCtrl: AlertController, 
    public http: Http,
    public modalCtrl: ModalController
  ) {
  
        this.tab1Root = this;
        this._ioService.getIntro();

        this.messages = [];
        this.styles = new Array();

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

        this.messages.push( { plantilla: { 
                                mensaje: "¡Hola! Bienvenido a 8enlinea." ,
                                autor: {
                                  username: '8enlinea'
                                }
                              } 
                            } 
                           );

  }

  ngOnInit(): void {
      //register to the observable
      this._ioService.ioMessage$
          .subscribe( message => {
              console.log( "iOservice message in home: ", message );
              let anuncio:any = message;
              if( anuncio.accion == "nueva_historia"){
                console.log( 'Ignoring broadcast in home' );
              }else{
                this.displayMessage( message );
              }
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
      message.plantilla.estado = 'pendiente';
      let current_message:string = String( this.messages.length );

      // Simula espera para respuesta
      setTimeout(() => {
        console.log( "Current message index: ", current_message );
        message.plantilla.estado = 'escribiendo';
        this.messages.push( message );
        this.buttons = [
           {
             text: 'Cancelar',
             role: 'cancel',
             handler: () => {
               console.log('Cancel clicked');
             }
           }
         ];

        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 100 );

        // Simula tiempo escribiendo  
        setTimeout(() => {
          console.log( "Setting estado enviado", this.messages[ current_message ] );
          this.messages[ current_message ].plantilla.estado = 'enviado';
          for (var i = 0; i < message["plantilla"].respuestas.length; ++i) {
            let respuesta = message["plantilla"].respuestas[i];
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
          }, 100 );

          console.log( 'Running actions in home');
          if( message["plantilla"].acciones.length > 0 ){
            for (var i = 0; i < message["plantilla"].acciones.length; ++i) {
              console.log( "Intentando ejectutar acción: ", message["plantilla"].acciones[i] );
              this.accion( message["plantilla"].acciones[i] );
            }
          }
        }, message.plantilla.tiempo_escribiendo * 1000 );
      }, message.plantilla.tiempo_respuesta * 1000 );
    });
  }

  accion( accion ){
    if( accion.tipo == "inicia_conversacion" ){
      console.log( "Iniciando conversacion: ", accion.parametro );
      setTimeout(() => {
        this.navCtrl.setRoot( TabsPage );
      }, 4000);
    }else if( accion.tipo == "activa_mensaje" ){
      console.log( "Activando mensaje: ", accion.parametro );
      this._ioService.sendResponse( accion.parametro );
    }else if( accion.tipo == "cambia_css"){
      console.log( "Cambiando css: ", [ accion.parametro , accion.valor ] );
      this.styles[ accion.parametro ] = accion.valor;
    }else if( accion.tipo == "login" ){
      console.log( "Iniciando login desde accion" );
      this.toastService.showToast( 'Iniciando sesión...' );
       setTimeout(() => {
        this.presentModal();
       }, 3000);
    }else{
      console.log( "Acción pendiente de implementación: ", accion.tipo );
    }

    setTimeout(() => {
      this.content.scrollToBottom(300);
    });
  }

  enviarRespuesta( respuesta ){
    console.log('Enviando respuesta desde home.ts: ', respuesta );
    this.messages.push( { plantilla: { 
                            mensaje: respuesta.texto,
                            tiempo_respuesta: 0,
                            tiempo_escribiendo: 0,
                            autor: {
                               username: "me"
                            } 
                          } 
                      } );
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100 );
    this._ioService.sendResponse( respuesta.destino );
  }

  presentModal() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }
}