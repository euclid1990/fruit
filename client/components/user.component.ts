import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Component, NgZone, OnInit, OnDestroy} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import {PaginationService, PaginationControlsCmp, PaginatePipe, IPaginationInstance} from 'ng2-pagination';
import {RouteService} from './../services/route.service';
import {IUser, Users, GENDERS, userTransform, AVATARS} from './../../collections/users';
import {TooltipDirective} from './../directives/tooltip.directive';
import {GenderDirective} from './../directives/gender.directive';
import {AvatarDirective} from './../directives/avatar.directive';
import {PrettyPrintPipe} from './../pipes/pretty-print.pipe';

const ASC = 1, DESC = -1;

@Component({
    selector: 'div[name=user]',
    templateUrl: 'client/views/user/list.html',
    providers: [PaginationService],
    directives: [ROUTER_DIRECTIVES, PaginationControlsCmp, TooltipDirective, GenderDirective],
    pipes: [PrettyPrintPipe, PaginatePipe]
})

export class UserComponent extends MeteorComponent
                            implements OnInit, OnDestroy {
    public users: Mongo.Cursor<any> = null;
    public directionLinks: boolean = false;
    public maxSize: number = 7;
    public paginationId = 'custom';
    public itemsPerPage: number = 5;
    public currentPage: ReactiveVar<number> = new ReactiveVar<number>(1);
    public totalItems: ReactiveVar<number> = new ReactiveVar<number>(0);
    public sortBy: string = "profile.name";
    public userId: string;

    constructor(private zone: NgZone,
                private router: Router,
                private routeService: RouteService,
                private paginationService: PaginationService) {
        super();
        // Show tab navigation
        this.routeService.navbar(true);
    }

    ngOnInit() {
        // Perform complex initializations shortly after construction
        this.all();
    }

    ngOnDestroy() {
        // Unsubscribe from Users resource before Angular destroys the directive.
    }

    all() {
        this.autorun(() => {
            let options = {
                sort: { "profile.name": DESC },
                transform: userTransform
            };
            this.subscribe("users.all", options, this.currentPage.get(), () => {
                this.users = Users.find({}, {
                    limit: this.itemsPerPage,
                    skip: (this.currentPage.get() - 1) * this.itemsPerPage,
                    transform: userTransform
                });
                this.directionLinks = true;
            }, true);
            this.zone.run(() => {
                this.totalItems.set(Counts.get("users.total"));
                this.registerPagination(this.currentPage.get(), this.totalItems.get());
                this.userId = Meteor.userId();
            });
        });
    }

    registerPagination(currentPage: number, totalItems: number) {
        let config: IPaginationInstance = {
            id: this.paginationId,
            itemsPerPage: this.itemsPerPage,
            currentPage: currentPage,
            totalItems: totalItems
        };
        this.paginationService.register(config);
    }

    onPageChange(page: number) {
        this.currentPage.set(page);
    }

    goChat(userId: string) {
        this.router.navigate(['ChatDetail', { id: userId }]);
    }
}

@Component({
    selector: 'div[name=user-detail]',
    templateUrl: 'client/views/user/detail.html',
    directives: [AvatarDirective, TooltipDirective],
    pipes: [PrettyPrintPipe]
})

export class UserDetailComponent extends MeteorComponent {
    public user: Object;
    public userId: string = Meteor.userId();
    public id: string;

    constructor(private router: Router,
                private routeService: RouteService,
                private routeParams: RouteParams) {
        super();
        // Show tab navigation
        this.routeService.navbar(true);
        this.id = this.routeParams.get('id');
        this.exexcute();
    }

    exexcute() {
        this.subscribe("users.detail", this.id, () => {
            this.user = this.find(this.id)
        }, true);
    }

    find(id: string) {
        let options = {
            transform: userTransform
        };
        return Users.findOne({ _id: id }, options);
    }

    goBack() {
        window.history.back();
    }

    goChat(userId: string) {
        this.router.navigate(['Chat', { id: userId }]);
    }
}