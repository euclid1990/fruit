import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';
import {Counts} from 'meteor/tmeasday:publish-counts';
import {Component, NgZone, OnInit, OnDestroy} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {ROUTER_DIRECTIVES, RouteParams, Router} from '@angular/router-deprecated';
import * as Helpers from "./../../lib/helpers";
import {RouteService} from './../services/route.service';
import {IChannel, Channels, channelInitialize} from './../../collections/channels';
import {IMessage, Messages, messageInitialize} from './../../collections/messages';
import {IUser, Users, userTransform, userInitialize} from './../../collections/users';
import {ScrollBottomDirective} from './../directives/scroll-bottom.directive';
import {TooltipDirective} from './../directives/tooltip.directive';
import {AvatarDirective} from './../directives/avatar.directive';
import {FocusDirective} from './../directives/focus.directive';
import {KeepScrollDirective} from './../directives/keep-scroll.directive';
import {ReversePipe} from './../pipes/reverse.pipe';
import {PrettyPrintPipe} from './../pipes/pretty-print.pipe';
import {DatetimePipe} from './../pipes/datetime.pipe';
import {TruncatePipe} from './../pipes/truncate.pipe';

const ASC = 1, DESC = -1;

/**
 * Get list of your recent conversations
 */
@Component({
    selector: 'div[name=chat]',
    templateUrl: 'client/views/chat/list.html',
    directives: [ROUTER_DIRECTIVES, ScrollBottomDirective, TooltipDirective, AvatarDirective],
    pipes: [DatetimePipe, TruncatePipe, PrettyPrintPipe, ReversePipe]
})

export class ChatComponent extends MeteorComponent
                            implements OnInit, OnDestroy {

    public channels: Mongo.Cursor<IChannel> = null;
    public displayChannel: boolean = true;
    public totalChannel: ReactiveVar<number> = new ReactiveVar<number>(0);

    public fromId: string;

    constructor(private zone: NgZone,
                private router: Router,
                private routeService: RouteService,
                private routeParams: RouteParams) {
        super();
        if (!Meteor.userId()) {
            this.router.navigate(['Login']);
        }
        // Show tab navigation
        this.routeService.navbar(true);

        this.initChannels();
    }

    ngOnInit() {
        // Perform complex initializations shortly after construction
    }

    ngOnDestroy() {
        // Prevent memory leak when component destroyed
        this.zone.run(() => {
            this.channels = null;
        });
    }

    initChannels() {
        this.autorun(() => {
            this.fromId = Meteor.userId();
            let options = {
                sort: { "updatedAt": DESC },
            };
            this.subscribe("channels.all", options, this.fromId, () => {
                let conditions = {
                    $or: [
                        { "fromId": this.fromId },
                        { "targetId": this.fromId }
                    ]
                };
                this.channels = Channels.find(conditions, options);
            }, true);
            this.zone.run(() => {
                this.totalChannel.set(Counts.get("channels.total"));
            });
        });
    }

    goChatDetail(fromId: string, targetId: string) {
        if (this.fromId === fromId) {
            return this.router.navigate(['ChatDetail', { id: targetId }]);
        }
        return this.router.navigate(['ChatDetail', { id: fromId }]);
    }
}

/**
 * Get detail of specified conversation
 */
@Component({
    selector: 'div[name=chat]',
    templateUrl: 'client/views/chat/detail.html',
    directives: [ROUTER_DIRECTIVES, ScrollBottomDirective, TooltipDirective, AvatarDirective, FocusDirective, KeepScrollDirective],
    pipes: [DatetimePipe, TruncatePipe, PrettyPrintPipe, ReversePipe]
})

export class ChatDetailComponent extends MeteorComponent
                                    implements OnInit, OnDestroy {

    public channelId: ReactiveVar<string> = new ReactiveVar<string>(null);

    public subscription: any = null;
    public messages: Array<IMessage> = [];
    public itemsPerPage: number = 10;
    public currentPage: ReactiveVar<number> = new ReactiveVar<number>(1);
    public totalMessage: ReactiveVar<number> = new ReactiveVar<number>(0);
    public recentUpdate: number = 0;
    public createdAtMax: number = 0;
    public createdAtMin: number = 2147483647000; // 03:14:07 UTC on Tuesday, 19 January 2038
    public isFetching: boolean = true;
    public wait: boolean = true;
    public runtimes: number = 0;

    public msg: string;

    public fromId: string;
    public fromUser: IUser = userInitialize();
    public targetId: string;
    public targetUser: IUser = userInitialize();

    constructor(private zone: NgZone,
                private router: Router,
                private routeService: RouteService,
                private routeParams: RouteParams) {
        super();
        if (!(this.fromId = Meteor.userId())) {
            this.router.navigate(['Login']);
        }
        // Show tab navigation
        this.routeService.navbar(true);
        this.targetId = this.routeParams.get('id');
        this.initUsers();
        this.initMsgChannel();
        this.initMessages();
    }

    ngOnInit() {
        // Perform complex initializations shortly after construction
    }

    ngOnDestroy() {
        // Prevent memory leak when component destroyed
        this.zone.run(() => {
            this.channelId.set(null);
            this.messages = [];
            this.fromId = null;
        });
    }

    initMsgChannel() {
        this.autorun(() => {
            // Listen chat channel
            let chnConditions = {
                $or: [
                    { "fromId": this.fromId, "targetId": this.targetId },
                    { "fromId": this.targetId, "targetId": this.fromId },
                ]
            };
            let chnOptions = {
                sort: { "updatedAt": DESC },
            };
            this.subscribe("channels.one", chnConditions, chnOptions, () => {
                Channels.find(chnConditions, chnOptions).observe({
                    // Receive channel you just created (First conversation between users)
                    added: () => {
                        this.watchMsgChannel(chnConditions, chnOptions);
                    }
                });
            }, true);
        });
    }

    watchMsgChannel(chnConditions: Object, chnOptions: Object) {
        let chn = Channels.findOne(chnConditions, chnOptions);
        if (chn) {
            this.channelId.set(chn._id);
        }
    }

    initMessages() {
        this.autorun(() => {
            if (this.channelId.get() !== null) {
                // Listen messages
                let msgOptions = {
                    limit: this.currentPage.get()* this.itemsPerPage,
                    sort: { "createdAt": DESC }
                };
                let msgConditions = { "channelId": this.channelId.get() };
                this.subscription = this.subscribe("messages.all", msgConditions, msgOptions, () => {
                        this.zone.run(() => {
                            // Change the results order to ASC for showing latest message at the bottom
                            let options = {};
                            if (this.messages.length) {
                                options = { createdAt: { $lt: this.createdAtMin } };
                            }
                            let msgs: Array<IMessage> = Messages.find(options, {
                                limit: this.itemsPerPage,
                                sort: { "createdAt": DESC }
                            }).fetch();
                            let msgsLength = msgs.length;
                            if (msgsLength) {
                                this.isFetching = false;
                                this.createdAtMax = (this.createdAtMax === 0) ? msgs[0].createdAt : this.createdAtMax;
                                this.createdAtMin = msgs[msgsLength - 1].createdAt;
                                this.runtimes++;
                                if (this.runtimes === 1) {
                                    this.recentUpdate++;
                                    setTimeout(() => {
                                        this.wait = false;
                                    }, 500);
                                }
                                this.messages = msgs.reverse().concat(this.messages);
                            } else {
                                this.isFetching = null;
                            }

                            // Watch new messages
                            Messages.find({ createdAt: { $gt: this.createdAtMax } }).observe({
                                added: (item: any) => {
                                    this.zone.run(() => {
                                        if (this.createdAtMax < item.createdAt) {
                                            if (this.runtimes > 0 || (this.messages.length === 0 && this.runtimes === 0)) {
                                                this.messages.push(item);
                                                this.recentUpdate++;
                                                this.runtimes++;
                                            }
                                            this.createdAtMax = item.createdAt;
                                        }
                                    });
                                }
                            });
                        });
                });
            }
        });
    }

    getId(obj: any) {
        return obj._id;
    }

    initUsers() {
        this.autorun(() => {
            this.subscribe("users.detail", this.fromId, () => {
                let options = {
                    transform: userTransform
                };
                this.fromUser = <IUser>Users.findOne({ _id: this.fromId }, options);
            }, true);
            this.subscribe("users.detail", this.targetId, () => {
                let options = {
                    transform: userTransform
                };
                this.targetUser = <IUser>Users.findOne({ _id: this.targetId }, options);
            }, true);
        });
    }

    send() {
        if (Helpers.isNullOrWhiteSpace(this.msg)) {
            return;
        }
        if (!this.channelId.get()) {
            this.runtimes = 2;
            Channels.insert(<IChannel>channelInitialize(this.fromId, this.fromUser.profile.name, this.fromUser.profile.avatar,
                this.targetId, this.targetUser.profile.name, this.targetUser.profile.avatar, null),
                (err, result) => {
                    this.store(result);
                }
            );
        } else {
            this.store(this.channelId.get());
        }
    }

    store(id: string) {
        let msg = this.msg;
        Channels.update({ _id: id }, { $set: { updatedAt: Date.now(), message: msg } }, (err, result) => {
            Messages.insert(<IMessage>messageInitialize(id, this.fromId, msg), (err, result) => {
                this.zone.run(() => {
                    this.msg = null;
                });
            });
        });
    }

    goChatList() {
        return this.router.navigate(['Chat']);
    }

    more(event: any) {
        let reachToTop = (event.target.scrollHeight - event.target.scrollTop) * 100 / event.target.scrollHeight;
        if ((reachToTop > 80) && !this.isFetching && (this.isFetching !== null) && (this.runtimes > 0)) {
            // Remove the subscription's data from the client's cache.
            this.subscription.stop();
            this.isFetching = true;
            let current = this.currentPage.get();
            console.log(`Page: ${current}`);
            this.currentPage.set(++current);
        };
    }

    onScroll(event) {
        if (!this.wait) {
            this.more(event)
            this.wait = true;
            setTimeout(() => {
                this.wait = false;
            }, 50);
        }
    }
}