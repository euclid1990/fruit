import {Component, Injectable, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class RouteService {

    // Observable string sources
    private navbarSource = new Subject<boolean>();
    // Observable string streams
    public navbar$ = this.navbarSource.asObservable();
    // Service message commands
    navbar(flag: boolean) {
        this.navbarSource.next(flag);
    }
}