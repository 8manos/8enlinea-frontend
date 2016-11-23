import { Component } from '@angular/core';
import { Platform, ionicBootstrap, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { TabsPage } from './pages/tabs/tabs';
import { MultimediaPipe } from './pipes/multimedia.pipe';

@Component({
  templateUrl: 'build/app.html',
  pipes: [ MultimediaPipe ]
})

export class MyApp {

  public rootPage: any;
  public conversaciones:Array<Object>;

  constructor(private platform: Platform ) {
    this.rootPage = HomePage;
    this.conversaciones = [];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap( MyApp );
