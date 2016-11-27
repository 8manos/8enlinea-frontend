import { Component, enableProdMode } from '@angular/core';
import { Platform, ionicBootstrap, Nav, Page } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { TabsPage } from './pages/tabs/tabs';
import { MultimediaPipe } from './pipes/multimedia.pipe';
import { ioService } from './services/io.service';
import { ToastService } from './services/toast.service';
import * as moment from 'moment';
enableProdMode();
declare var window: any;

@Component({
  templateUrl: 'build/app.html',
  pipes: [ MultimediaPipe ]
})

export class MyApp {

  public rootPage: any;
  public conversaciones:Array<Object>;

  constructor(private platform: Platform) {
    this.rootPage = HomePage;
    this.conversaciones = [];

    platform.ready().then(() => {
      if ( this.platform.is( 'cordova' ) ){
        console.log("Is cordova");
        window.open = (url, target?, opts?) => InAppBrowser.open(url, target, opts);
      }else{
        console.log("Is not cordova");
      }

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap( MyApp, [ioService, ToastService] );
