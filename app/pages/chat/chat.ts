import { Component, OnInit } from '@angular/core';
import { ConversacionPage } from '../conversacion/conversacion'
import { AlertController, Nav, NavController, ActionSheetController, MenuController } from 'ionic-angular';
import { Http } from "@angular/http";
import { NgZone } from "@angular/core";
import { ioService } from '../../services/io.service';
import { ToastService } from '../../services/toast.service';
import { TimeagoPipe } from '../../pipes/moment.pipe';

@Component({
  templateUrl: 'build/pages/chat/chat.html',
  pipes: [TimeagoPipe]
})

export class ChatPage implements OnInit {
  public conversaciones:any;
  private subscription:any;
  private _ioServiceMessages: Array<{}>;
  private zone;

  constructor(
      private toastService: ToastService,
      private _ioService: ioService, 
      private menu: MenuController, 
      private navCtrl: NavController
  ) {
      this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit(): void {
      //register to the observables
      this._ioService.getConversaciones();
      this._ioService.ioMessage$
          .subscribe(message => {
              console.log( "iOservice message in chat.ts: ", message );
              let anuncio:any = message;
              if( anuncio.accion == "nueva_historia"){
                console.log( "Recargando conversaciones" );
                this.toastService.showToast('Se ha iniciado una nueva conversación.');
                this.refrescarConversaciones();
              }
          });
          
      this.subscription = this._ioService.conversaciones.subscribe(
        resData => {
          this.zone.run( () => {
            console.log( "Conversaciones from subscription: ", resData );
            this.conversaciones = resData;
          });
        }

      );
      this.refrescarConversaciones();
  }

  load_conversacion( conversacion ){
    console.log( 'Loading conversacion: ', conversacion );
    this.navCtrl.push( ConversacionPage, { conversacion: conversacion } );
    this.menu.close();
  }

  refrescarConversaciones(){
    console.log("Actualizando conversaciones.");
    this._ioService.loadConversaciones().then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'LoadConversaciones promise resolved with data: ', data );
          this.conversaciones = data;
        });
      }
    );
  }

	ionViewDidEnter() {
    this.refrescarConversaciones();
		this.menu.enable(true, 'menu_conversaciones');
		this.menu.enable(false, 'menu_main');
    this.menu.open();
	}

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }
}
