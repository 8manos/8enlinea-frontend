import { BehaviorSubject } from 'rxjs/Rx'
import { Conversacion } from '../models/Conversacion'
import { Injectable } from '@angular/core'
import { Mensaje } from '../models/Mensaje'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { ToastService } from '../services/toast.service'
import { Http } from '@angular/http'

declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

@Injectable()
export class ioService {
    private _ioMessage$: Subject<{}>;
    private _conversaciones: BehaviorSubject<Array<Object>> = new BehaviorSubject(Array([]));
    public conversaciones: Observable<Array<Object>> = this._conversaciones.asObservable();
    private _conversacion: BehaviorSubject<Array<Object>> = new BehaviorSubject(Array([]));
    public conversacion: Observable<Array<Object>> = this._conversacion.asObservable();
    private socket;
    public socketHost:String;
    public connected;
    public socket_host:string;

    constructor( private toastService: ToastService, private http: Http ) {

        this.socket_host = this.socket_url();

        console.log("Socket host: ", this.socket_host );
        this.connect( this.socket_host, function(){} );
        this._ioMessage$ = <Subject<{}>>new Subject();
        this.registerSailsListener();
    }

    get ioMessage$() {
        return this._ioMessage$.asObservable();
    }

    socket_url(){
      // return "http://localhost:1337/";
      return "http://backend.ochoenlinea.com/";
    }
    connect( socket_host, callback:Function ) {
      if( this.connected ){
        console.log("Socket is already connected.");
      }else{
        console.log("Socket is connecting.");
        this.toastService.showToast( 'Conectando al servidor...' );
        this.socket = io.sails.connect( socket_host );
        this.socket.on( 'connect', () => {
          console.log("Socket is now connected");
          this.toastService.showToast( 'Conexión exitosa!' );
          this.connected = true; 
          callback();
        });
        this.socket.on( 'disconnect', () => {
          console.log("Socket is now disconnected");
          this.toastService.showToast( 'El servidor se ha desconectado...' );
          this.connected = false; 
        });
      }
    }

    registerSailsListener(): void {
        this.socket.on('message', (data) => {
            this._ioMessage$.next(data);
        }); 

        this.socket.on('nuevo_mensaje', (data) => {
            // this.toastService.showToast( 'Nuevo mensaje...' );
            this._ioMessage$.next(data);
        });

        this.socket.on('nueva_accion', (data) => {
            // this.toastService.showToast( 'Ejecutando alguna accion...' );
            this._ioMessage$.next(data);
        });

        this.socket.on('nuevo_toast', (data) => {
            // this.toastService.showToast( 'Ejecutando alguna accion...' );
            setTimeout( () => {
              this.toastService.showToast( data.toast.parametro )
            }, data.toast.valor | 1 );
        });
    }

    subscribeToSails() {
        this.socket.get('/room/join');
        this._ioMessage$.next({
            message: "Joined Chat Room"
        });
    }

    subscribeToConversacion( id ) {
        this.socket.get('/conversacion/subscribe', { 'id': id }, (response) => {    
          console.log('Subscription response: ', response );    
          this._ioMessage$.next({
              message: response
          });
        });
    }

    unsubscribeToConversacion( id ) {
        this.socket.get('/conversacion/unsubscribe', { 'id': id }, (response) => {    
          console.log('Unsubscription response: ', response );        
          this._ioMessage$.next({
              message: response
          });
        });
    }

    getIntro(){
      this.socket.get('/intro', null, function (resData) {
        console.log( 'intro: ', resData ); 
      });
    }

    getConversaciones( ) {
      console.log( "Getting conversaciones from io service");
      this.socket.get('/user/conversaciones', null, (resData) => {
        console.log( 'Conversaciones: ', resData ); 
        this._conversaciones.next( resData );
      });
    }

    getConversacion( id ) {
      console.log( "Getting conversacion "+ id +" from io service");
      this.socket.get('/conversacion/find/'+ id , (resData) => {
        console.log( 'Conversacion: ', resData ); 
        this._conversacion.next( resData.data.conversacion );
      });
    }

    sendResponse( destino ) {
      console.log( "Sending response from chat service: ", destino );
      this.socket.get('/conversacion/responder', {
          destino: destino
      }, ( resData ) => {
        console.log("Response data: ", resData );
        this._ioMessage$.next(resData);
      });
    }

    agregaRespuesta( conversacion, respuesta:any ){
      console.log( "Agregando respuesta en conversacion "+ conversacion +" from io service con destino: ", respuesta.destino );
      this.socket.get('/conversacion/agregarespuesta/'+ conversacion, {
          destino: respuesta.destino,
          texto: respuesta.texto
      }, ( resData ) => {
        console.log("Agrega respuesta response data: ", resData );
        // this._ioMessage$.next(resData);
      });
    }

    agregarMensaje( plantilla, conversacion ) {
      console.log( "Agregando mensaje from chat service en conversacion: " + conversacion + ", desde plantilla: ", plantilla );
      this.socket.get('/conversacion/agregar', {
          conversacion: conversacion,
          plantilla: plantilla
      }, ( resData ) => {
        console.log("Response data agregando mensaje: ", resData );
        // this._ioMessage$.next(resData);
      });
    }

    nuevaHistoria( historia ) {
      console.log( "Agregando nueva historia from chat service: ", historia );
      this.socket.get('/conversacion/nueva', {
          historia: historia
      }, ( resData ) => {
        console.log("Response data agregando historia: ", resData );
        // this._ioMessage$.next(resData);
      });
    }

    loadConversaciones(){
      return new Promise(resolve => {
        this.socket.get( '/user/conversaciones', ( data ) => {
          console.log("Trying to resolve loadConversaciones promise with data: ", data );
          resolve( data );
        });
      });
    }

    loadMessages( conversacion ){
      return new Promise(resolve => {
        this.socket.get( '/conversacion/findmensajes/'+ conversacion, ( data ) => {
          console.log("Trying to resolve loadMessages promise with data: ", data );
          resolve( data );
        });
      });
    }

    loadDetalles( conversacion ){
      return new Promise(resolve => {
        this.socket.get( '/conversacion/detalles/'+ conversacion, ( data ) => {
          console.log("Trying to resolve loadDetalles promise with data: ", data );
          resolve( data );
        });
      });
    }

    loadAnswers( conversacion ){
      return new Promise(resolve => {
        this.socket.get( '/conversacion/'+ conversacion +'/respuestas/', ( data ) => {
          console.log("Trying to resolve loadAnswers promise with data: ", data );
          resolve( data );
        });
      });
    }

    loadMe(){
      return new Promise(resolve => {
        this.socket.get( '/user/me/', ( data ) => {
          console.log("Trying to resolve loadMe promise with data: ", data );
          resolve( data );
        });
      });
    }

    unsubscribeToSails() {
        this.socket.get('/logout');
        this._ioMessage$.next({
            message: "Left Chat Room"
        });
    }
}