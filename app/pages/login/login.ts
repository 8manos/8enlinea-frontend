import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  constructor(private navCtrl: NavController, public viewCtrl: ViewController) {

  }

  auth( service ){
  	console.log( 'Initiating auth for: ', service );
  	let loginref:any = window.open( 'http://backend.ochoenlinea.com/auth/' + service, '_self', "location=no" );
	loginref.addEventListener('loadstart', (event:any) => { 
		if((event.url).startsWith("http://www.ochoenlinea.com") ) {
		    loginref.close();
		    this.viewCtrl.dismiss();
  			this.navCtrl.setRoot( TabsPage );
		}
	});

	loginref.addEventListener( "loadstop", (event:any) => {
		console.log( "Inappbrowser event: ", event );
    	if((event.url).startsWith("http://backend.ochoenlinea.com/auth/" + service + "/callback") ) {
    		loginref.executeScript(
	        	{ code: "document.getElementsByTagName('pre')[0].innerHTML" },
		        ( values ) => {
		            console.log( 'GOT FROM BROWSER: ', values[ 0 ] );
		        }
	    	);
		}
	});

  }

}
