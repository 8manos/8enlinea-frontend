import { Component } from '@angular/core';
import { Nav, NavController, NavParams,  MenuController } from 'ionic-angular';
import { Conversacion } from '../../models/Conversacion';
import { ioService } from '../../services/io.service';

@Component({
  templateUrl: 'build/pages/conversacion/conversacion.html',
  providers: [ioService]
})

export class ConversacionPage {
  public conversacion = Conversacion;

  constructor(
  	private _ioService: ioService,      
  	private menu: MenuController, 
  	private navCtrl: NavController, 
  	private navParams: NavParams) {
  		this.conversacion = navParams.get("conversacion");
  	}

 	ionViewDidEnter() {
		this.menu.enable(true, 'menu_conversaciones');
		this.menu.enable(false, 'menu_main');
	}

}
