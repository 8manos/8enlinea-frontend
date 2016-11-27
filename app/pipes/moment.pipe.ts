import { Pipe, PipeTransform } from '@angular/core';
import 'moment/locale/es';
import * as moment from 'moment';

@Pipe({
    name: 'moment',
    pure: false,
})

export class MomentPipe implements PipeTransform {
    transform(d:Date | moment.Moment, args?:any[]):string {
        let rv = moment(d).format(args[0]);
        return rv;
    }
}

@Pipe({
    name: 'timeago',
    pure: false,
})
export class TimeagoPipe implements PipeTransform {
    transform(d:Date | moment.Moment):string {
        moment.locale( 'es' );
        if (Math.abs(moment().diff(d)) < 5000) { 
            return 'ahora';
        }
        let rv = moment(d).fromNow();
        return rv;
    }
}