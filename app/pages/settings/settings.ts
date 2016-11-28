import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ioService } from '../../services/io.service';
import { ToastService } from '../../services/toast.service'

/*
  Generated class for the SettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/settings/settings.html',
})
export class SettingsPage {
  private zone;
  
  constructor( private toastService: ToastService, private navCtrl: NavController, private _ioService: ioService ) {
  	this.zone = new NgZone({ enableLongStackTrace: false });
  }

  reset(){
  	this._ioService.resetUser().then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'resetUser promise resolved with data: ', data );
          this.toastService.showToast( 'Todas las conversaciones han sido eliminadas.' );
        });
      }
    );
  }

}
