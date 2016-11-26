import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DetallesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/detalles/detalles.html',
})
export class DetallesPage {
  public conversacion:any;
  
  constructor(
  	private navCtrl: NavController,
  	private navParams: NavParams
  ) {
  	this.conversacion = navParams.get("conversacion");
  }

}
