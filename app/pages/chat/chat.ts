import { Component, OnInit } from '@angular/core';
import { ConversacionPage } from '../conversacion/conversacion'
import { AlertController, Nav, NavController, ActionSheetController, MenuController } from 'ionic-angular';
import { Http } from "@angular/http";
import { NgZone } from "@angular/core";
import { ioService } from '../../services/io.service';

@Component({
  templateUrl: 'build/pages/chat/chat.html'
})

export class ChatPage implements OnInit {
  public conversaciones:any;
  private _ioServiceMessages: Array<{}>;

  constructor(
      private _ioService: ioService, 
      private menu: MenuController, 
      private navCtrl: NavController
  ) {
      this._ioService.getConversaciones();
      console.log( "Resultado de conversaciones en chat.ts: ", this.conversaciones );
  }

  ngOnInit(): void {
      //register to the observables
      this._ioService.ioMessage$
          .subscribe(message => {
              console.log( "iOservice message: ", message );
          });
      this._ioService.conversaciones.subscribe(
        resData => {
          console.log( "ResData Subscribed: ", resData );
          this.conversaciones = resData;
        }
      );
  }

  load_conversacion( conversacion ){
    console.log( 'Loading conversacion: ', conversacion );
    this.navCtrl.push( ConversacionPage, { conversacion: conversacion } );
    this.menu.close();
  }

	ionViewDidEnter() {
		this.menu.enable(true, 'menu_conversaciones');
		this.menu.enable(false, 'menu_main');
	}
}
