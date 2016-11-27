import { Component, OnInit , NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ioService } from '../../services/io.service';
import { MultimediaPipe } from '../../pipes/multimedia.pipe';
import { TimeagoPipe } from '../../pipes/moment.pipe';

/*
  Generated class for the DetallesPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'build/pages/detalles/detalles.html',
  pipes: [MultimediaPipe, TimeagoPipe]
})

export class DetallesPage implements OnInit  {
  public conversacion:any;
  private zone;
  
  constructor(
  	private navCtrl: NavController,
    private _ioService: ioService,
  	private navParams: NavParams
  ) {
  	this.conversacion = navParams.get("conversacion");
    this.conversacion.usuarios = [];
    this.conversacion.mensajes = [];
    this.zone = new NgZone({ enableLongStackTrace: false });
  }

  ngOnInit(): void {
      this.traerDetalles();
  }

  traerDetalles(){
    console.log("Actualizando detalles.");
    this._ioService.loadDetalles( this.conversacion.id ).then( 
      (data) => { 
        this.zone.run(() => {
          console.log( 'Loaddetalles promise resolved with data: ', data );
          this.conversacion = data;
        });
      }
    );
  }

}
