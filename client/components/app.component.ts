import 'reflect-metadata';
import 'zone.js/dist/zone';
import {MeteorComponent} from 'angular2-meteor';
import {Component, NgZone} from '@angular/core';
import {Meteor} from 'meteor/meteor';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {Routes} from './../routes';
import {OpenSearchDirective} from './../directives/open-search.directive';

@Component({
    selector: 'app',
    templateUrl: 'client/views/app.html',
    directives: [ROUTER_DIRECTIVES, OpenSearchDirective],
    providers: [ROUTER_PROVIDERS]
})

@RouteConfig(Routes)

export class AppComponent extends MeteorComponent {
    public user: Meteor.User = null;

    constructor(private zone: NgZone,
                public router: Router) {
        super();
        this.setUser();
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
}