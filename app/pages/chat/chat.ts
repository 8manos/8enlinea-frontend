import { Component, OnInit } from '@angular/core';
import { AlertController, Nav, NavController, ActionSheetController, MenuController } from 'ionic-angular';
import {Http} from "@angular/http";
import {NgZone} from "@angular/core";
import { ioService } from '../../services/io.service'
declare var socketIOClientStatic:any;
declare var SailsIOClient:any;
declare var io:any;

@Component({
  templateUrl: 'build/pages/chat/chat.html',
  providers: [ioService]
})

export class ChatPage implements OnInit {
  public conversaciones:any;
  private _ioServiceMessages: Array<{}>;

  constructor(
      private _ioService: ioService, 
      private menu: MenuController, 
      private navCtrl: NavController
  ) {
    	this.conversaciones = [];
      var tmp_conversaciones = this._ioService.getConversaciones();
      this.conversaciones = this._ioService.getConversaciones();
      console.log( "Resultado de conversaciones en chat.ts: ", this.conversaciones );
  }

  ngOnInit(): void {
      //register to the observable
      this._ioService.ioMessage$
          .subscribe(message => {
              console.log( "iOservice message: ", message );
          });
  }

	ionViewDidEnter() {
		this.menu.enable(true, 'menu_conversaciones');
		this.menu.enable(false, 'menu_main');
	}
}
