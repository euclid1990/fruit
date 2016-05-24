import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';

@Component({
    selector: 'div[name=dashboard]',
    templateUrl: 'client/views/user.html'
})

export class UserComponent {
    public message: string = "Welcome to User";
}