import { Injectable, Inject } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
	export class ToastService {
	constructor( public toastCtrl: ToastController ) {
	}

	showToast( message ) {
		let toast = this.toastCtrl.create({
			position: "top",
			message: message,
			duration: 3333
		});
		toast.present();
	}
}