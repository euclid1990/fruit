import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Subscription}   from 'rxjs/Subscription';
import {MeteorComponent} from 'angular2-meteor';
import {Component, NgZone, OnDestroy} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Routes} from './../routes';
import {RouteService} from './../services/route.service';
import {OpenSearchDirective} from './../directives/open-search.directive';
import {RegisterComponent} from './auth.component';

@Component({
    selector: 'app',
    templateUrl: 'client/views/app.html',
    directives: [ROUTER_DIRECTIVES, OpenSearchDirective, RegisterComponent],
    providers: [ROUTER_PROVIDERS, RouteService]
})

@RouteConfig(Routes)

export class AppComponent extends MeteorComponent {
    public user: Meteor.User = null;
    public navbar: boolean = true;
    public subscription: Subscription;

    constructor(private zone: NgZone,
                public router: Router,
                private routeService: RouteService) {
        super();
        this.setUser();
        this.routeService.navbar$.subscribe(flag => {
            this.navbar = flag;
        })
    }

    ngOnDestroy() {
        // Prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

    setUser() {
        // Run a function that depends on reactive data sources, in such a way that:
        // if there are changes to the data later, the function will be rerun.
        this.autorun(() => {
            this.zone.run(() => {
                this.user = Meteor.user();
            });
        });
    }

    isRouteActive(routerName: string) {
        // Active link by router name
        let currentInstruction = this.router.currentInstruction;
        if (currentInstruction) {
            if (currentInstruction.component.routeName === routerName) {
                return true;
            }
        }
        return false;
    }
}