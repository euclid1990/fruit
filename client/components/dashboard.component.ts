import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';
import {RouteService} from './../services/route.service';

@Component({
    selector: 'div[name=dashboard]',
    templateUrl: 'client/views/dashboard.html'
})

export class DashboardComponent {
    public message: string = "Welcome to Dashboard";

    constructor(private routeService: RouteService) {
        // Show tab navigation
        this.routeService.navbar(true);
    }
}