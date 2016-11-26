import { Component, OnInit, NgZone } from '@angular/core';
import { Nav, NavController, NavParams,  MenuController } from 'ionic-angular';
import { Conversacion } from '../../models/Conversacion';
import { Http } from "@angular/http";
import { ioService } from '../../services/io.service';
import { DetallesPage } from '../detalles/detalles';

@Component({
  templateUrl: 'build/pages/conversacion/conversacion.html'
})

export class ConversacionPage implements OnInit {
  public conversacion:any;
  public conversacion_requested:any;
  private _ioServiceMessages: Array<{}>;
  private zone;

  constructor(
  	private _ioService: ioService,      
  	private menu: MenuController, 
  	private navCtrl: NavController, 
  	private navParams: NavParams) {
  		this.conversacion_requested = navParams.get("conversacion");
      this.zone = new NgZone({ enableLongStackTrace: false });
      this._ioService.getConversacion( this.conversacion_requested.id );
  	}

  ngOnInit(): void {
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
  }

  showConversacion( conversacion ){
    this.zone.run(() => {
      this.conversacion = conversacion;
      console.log('Scope conversación: ', this.conversacion );
      this.subscribe( this.conversacion.id );
    });
  }

  subscribe( id ) {
    console.log("Viendo conversación: "+ id );
    this._ioService.subscribeToConversacion( id );
  }

  ionViewDidEnter() {
    console.log("Retomando conversación: "+ this.conversacion.id );
    this._ioService.subscribeToConversacion( this.conversacion.id );
  }

  ionViewDidLeave() {
    console.log("Abandonando conversación: "+ this.conversacion.id );
    this._ioService.unsubscribeToConversacion( this.conversacion.id );
  }

  verDetalles() {
    console.log("Cargando detalles de conversación: ");
    this.navCtrl.push( DetallesPage, { conversacion: this.conversacion } );
  }

}
