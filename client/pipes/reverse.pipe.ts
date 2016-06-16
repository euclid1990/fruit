import {Pipe, PipeTransform} from '@angular/core';
import {NgZone} from '@angular/core';
import {Mongo} from 'meteor/mongo';

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {

    constructor(private zone: NgZone) {
    }

    transform(value: any): any {
        if (value instanceof Array) {
            return value.reverse();
        } else if (value instanceof Mongo.Cursor) {
            return value.fetch().reverse();
        }
        return value;
    }
}