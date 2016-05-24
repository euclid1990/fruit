import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {AppComponent} from './components/app.component';

bootstrap(AppComponent, [ROUTER_PROVIDERS]);