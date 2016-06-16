// http://docs.meteor.com/api/accounts.html
import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {MeteorComponent} from 'angular2-meteor';
import {Component, NgZone} from '@angular/core';
import {FormBuilder, Control, ControlGroup, Validators} from '@angular/common';
import {Router} from '@angular/router-deprecated';
import {GENDERS, Gender, User, Users, userInitialize, AVATARS} from './../../collections/users';
import {EmailValidator} from './../validators/email.validator';
import {PasswordValidator} from './../validators/password.validator';
import {RouteService} from './../services/route.service';
import {PrettyPrintPipe} from './../pipes/pretty-print.pipe';
import * as Helpers from "./../../lib/helpers";
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'div[name=register]',
    templateUrl: 'client/views/auth/register.html',
    providers: [EmailValidator, PasswordValidator],
    pipes: [PrettyPrintPipe]
})

export class RegisterComponent {
    public model: User = userInitialize();
    public genders: Array<Gender> = GENDERS;
    public form: ControlGroup;
    public error: string;
    public second: number = 6;
    public submitted: boolean = false;

    constructor(private zone: NgZone,
                private router: Router,
                private routeService: RouteService,
                private fb: FormBuilder,
                private ev: EmailValidator,
                private pv: PasswordValidator) {
        this.middleware();
        // No need to decalare provider for RouteService
        // because RegisterComponent is a child of the AppComponent and therefore receives its parent's service instance.
        this.routeService.navbar(false);
        this.form = this.fb.group({
            name: ['', Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50)
            ])],
            gender: ['', Validators.required],
            email: ['',
                Validators.compose([
                    Validators.required,
                    this.ev.format
                ]),
                this.ev.taken
            ],
            passwords: this.fb.group({
                password: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(30)
                ])],
                password_confirmation: ['', Validators.required]
            }, {validator: this.pv.confirm})
        });
        this.model.profile.gender = null;
    }

    middleware() {
        if (Meteor.userId() !== null) {
            this.router.navigate(['Dashboard']);
        }
    }

    redirect() {
        this.second -= 1;
        if (this.second >= 0) {
            window.setTimeout(() => this.redirect(), 1000);
        } else {
            this.router.navigate(['Login']);
        }
    }

    goBack() {
        window.history.back();
    }

    onSubmit() {
        if (this.form.valid) {
            // Set avatar for user
            this.model.profile.avatar = Helpers.randomArray(AVATARS);
            Accounts.createUser(this.model, (err) => {
                // Execute function synchronously within the Angular zone
                this.zone.run(() => {
                    if (err) {
                        this.error = err;
                    } else {
                        this.error = '';
                        this.model = userInitialize();
                        this.submitted = true;
                        this.redirect();
                    }
                });
            });
        }
    }
}

@Component({
    selector: 'div[name=login]',
    templateUrl: 'client/views/auth/login.html',
    providers: [EmailValidator],
    pipes: [PrettyPrintPipe]
})

export class LoginComponent {
    public model: User = userInitialize();
    public form: ControlGroup;
    public error: string;

    constructor(private zone: NgZone,
                private router: Router,
                private routeService: RouteService,
                private fb: FormBuilder,
                private ev: EmailValidator) {
        this.middleware();
        this.routeService.navbar(false);
        this.form = this.fb.group({
            email: ['',
                Validators.compose([
                    Validators.required,
                    this.ev.format
                ])
            ],
            password: ['', Validators.required]
        });
    }

    middleware() {
        if (Meteor.userId() !== null) {
            this.router.navigate(['Dashboard']);
        }
    }

    goBack() {
        window.history.back();
    }

    onSubmit() {
        if (this.form.valid) {
            Meteor.loginWithPassword(this.model.email, this.model.password, (err) => {
                // Execute function synchronously within the Angular zone
                this.zone.run(() => {
                    if (err) {
                        this.error = err;
                    } else {
                        this.error = '';
                        this.router.navigate(['Dashboard']);
                    }
                });
            });
        }
    }
}

@Component({
    selector: 'div[name=logout]',
    templateUrl: 'client/views/auth/logout.html'
})

export class LogoutComponent {

    constructor(private zone: NgZone,
                private router: Router) {
        Meteor.logout();
        this.router.navigate(['Dashboard']);
    }
}
