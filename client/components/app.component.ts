import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';
import {RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Routes} from './../routes';
import {OpenSearchDirective} from './../directives/open-search.directive';

@Component({
    selector: 'app',
    templateUrl: 'client/views/app.html',
    directives: [ROUTER_DIRECTIVES, OpenSearchDirective],
    providers: [ROUTER_PROVIDERS]
})

@RouteConfig(Routes)

export class AppComponent {

}