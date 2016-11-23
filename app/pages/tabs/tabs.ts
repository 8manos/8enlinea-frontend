import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { ChatPage } from '../chat/chat';
import { ContactPage } from '../contact/contact';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})

export class TabsPage {

  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;
  public tab4Root: any;
  public tab5Root: any;

  constructor(
   public navCtrl: NavController
  ) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
    this.tab4Root = ChatPage;
    this.tab5Root = SettingsPage;
  }
}
