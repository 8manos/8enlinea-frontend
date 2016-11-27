import { BehaviorSubject } from 'rxjs/Rx'
import { Conversacion } from '../models/Conversacion'
import { Injectable } from '@angular/core'
import { Mensaje } from '../models/Mensaje'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { ToastService } from '../services/toast.service'

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

    constructor( private toastService: ToastService ) {

        var socket_host = this.socket_url();

        console.log("Socket host: ", socket_host );
        this.connect( socket_host, function(){} );
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
            this._ioMessage$.next(data);
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
      this.socket.get('/conversacion', {'id': id}, (resData) => {
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

    unsubscribeToSails() {
        this.socket.get('/logout');
        this._ioMessage$.next({
            message: "Left Chat Room"
        });
    }
}