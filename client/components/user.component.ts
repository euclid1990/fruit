import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';
import {RouteService} from './../services/route.service';

@Component({
    selector: 'div[name=dashboard]',
    templateUrl: 'client/views/user.html'
})

export class UserComponent {
    public message: string = "Welcome to User";

    constructor(private routeService: RouteService) {
        // Show tab navigation
        this.routeService.navbar(true);
    }
}