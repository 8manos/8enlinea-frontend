import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/contact/contact.html'
})

export class ContactPage {
  constructor(private menu: MenuController, private navCtrl: NavController) {
  }
  ionViewDidEnter() {
	console.log("Ion view did enter contacts", this.menu );
	this.menu.enable(true, 'menu_main');
	this.menu.enable(false, 'menu_conversaciones');
  }
}
