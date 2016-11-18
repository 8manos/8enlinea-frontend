import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser'; 

@Pipe({name: 'multimedia'})
export class MultimediaPipe implements PipeTransform {
  constructor(
  	private sanitizer: DomSanitizationService
  ){}

  transform( value: string ) {
  	let regExp = /\.(jpeg|jpg|gif|png)$/;
  	let match = value.match(regExp);
  	if( match ){
  		return "<img src='" + value + "'>";
  	}else{		
	  	let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	  	let match = value.match(regExp);
		if (match && match[2].length == 11) { // Iframe
			return this.sanitizer.bypassSecurityTrustHtml('<iframe width="560" height="315" src="https://www.youtube.com/embed/'+match[2]+'?rel=0" frameborder="0" allowfullscreen></iframe>');
		} else {
		    return "Multimedia desconocida: " + value;
		}
  	}
  }
}