import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';

@Component({
    selector: 'app',
    templateUrl: 'client/views/app.html'
})

export class AppComponent {
    public message: string = "Getting started with Meteor-Angular 2";
}