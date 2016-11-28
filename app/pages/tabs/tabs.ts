import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ChatPage } from '../chat/chat';
import { ContactPage } from '../contact/contact';
import { SettingsPage } from '../settings/settings';
import { ioService } from '../../services/io.service';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})

export class TabsPage {
  private subscription: any;
  private zone;
  public conteos: any;
  public test:string = "test";
  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;
  public tab4Root: any;
  public tab5Root: any;

  constructor(
   public navCtrl: NavController,
   private _ioService: ioService
  ) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
    this.tab4Root = ChatPage;
    this.tab5Root = SettingsPage;
    this.test = 'test';
    this.conteos = { mensajes: 0, contactos: 0, conversaciones: 0 };
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ionViewDidEnter() {
      this.subscription = this._ioService.conteos.subscribe(
        resData => {
          let datos:any = resData;
          if (typeof datos != 'undefined' && datos.conversaciones  ){
            this.zone.run( () => {
                console.log( "conteos Subscribed: ", datos );
                this.conteos =  datos;
              }
            );
          }
        }
      );

      this._ioService.getConteos();
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }
}
