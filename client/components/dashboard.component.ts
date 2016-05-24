import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';

@Component({
    selector: 'div[name=dashboard]',
    templateUrl: 'client/views/dashboard.html'
})

export class DashboardComponent {
    public message: string = "Welcome to Dashboard";
}