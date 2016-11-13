import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

@Injectable()
export class ioService {
    private _ioMessage$: Subject<{}>;
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
      //return "http://localhost:1337/";
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
      var socket_host = this.socket_url();
      console.log("Connected status: ", this.connected );
      if( this.connected ){ 
        console.log( "Getting conversaciones from io service");
        this.socket.get('/user/conversaciones', null, (resData) => {
          console.log( 'conversaciones: ', resData ); 
          return resData;
        });
      }else{
        console.log( "Waiting for connection...");
        this.connect( socket_host, () => { this.getConversaciones() } );
      }
    }

    sendResponse( destino ) {
      console.log( "Sending response from chat service: ", destino );
      this.socket.post('/room/submit', {
          message: destino
      });
    }

    unsubscribeToSails() {
        this.socket.get('/room/leave');
        this._ioMessage$.next({
            message: "Left Chat Room"
        });
    }
}