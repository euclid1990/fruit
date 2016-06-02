import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {RouteService} from './../services/route.service';

@Component({
    selector: 'div[name=dashboard]',
    templateUrl: 'client/views/dashboard.html'
})

export class DashboardComponent extends MeteorComponent {
    public message: string = "Welcome to Dashboard";

    constructor(private routeService: RouteService) {
        super();
        // Show tab navigation
        this.routeService.navbar(true);
    }
}