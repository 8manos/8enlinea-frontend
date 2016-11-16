import { BehaviorSubject } from 'rxjs/Rx'
import { Conversacion } from '../models/Conversacion'
import { Injectable } from '@angular/core'
import { Mensaje } from '../models/Mensaje'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

@Injectable()
export class ioService {
    private _ioMessage$: Subject<{}>;
    private _conversaciones: BehaviorSubject<Array<Object>> = new BehaviorSubject(Array([]));
    public conversaciones: Observable<Array<Object>> = this._conversaciones.asObservable();
    private socket;
    public socketHost:String;
    public connected;

    constructor() {
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
      return "http://ochoenlinea-backend.herokuapp.com/";
    }
    connect( socket_host, callback:Function ) {
      if( this.connected ){
        console.log("Socket is already connected.");
      }else{
        console.log("Socket is connecting.");
        this.socket = io.sails.connect( socket_host );
        this.socket.on( 'connect', () => {
          console.log("Socket is now connected");
          this.connected = true; 
          callback();
        });
        this.socket.on( 'disconnect', () => {
          console.log("Socket is now disconnected");
          this.connected = false; 
        });
      }
    }

    registerSailsListener(): void {
        this.socket.on('message', (data) => {
            this._ioMessage$.next(data);
        }); 
    }

    subscribeToSails() {
        this.socket.get('/room/join');
        this._ioMessage$.next({
            message: "Joined Chat Room"
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

    sendResponse( destino ) {
      console.log( "Sending response from chat service: ", destino );
      this.socket.get('/conversacion/responder', {
          destino: destino
      }, ( resData ) => {
        console.log("Response data: ", resData );
        this._ioMessage$.next(resData);
      });
    }

    unsubscribeToSails() {
        this.socket.get('/logout');
        this._ioMessage$.next({
            message: "Left Chat Room"
        });
    }
}