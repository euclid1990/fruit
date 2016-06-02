import {Meteor} from 'meteor/meteor';
import {Users} from './../../collections/users';
import {Counts} from 'meteor/tmeasday:publish-counts';
import * as Helpers from "./../../lib/helpers";

Meteor.publish("users.all", function(options: Object) {
    Counts.publish(this, "users.total", Users.find({}), { noReady: true });
    let secure = {
        fields: {
            "emails.address": 1,
            "createdAt": 1,
            "profile": 1
        }
    }
    options = Helpers.mergeOptions(options, secure);
    return Users.find({}, options);
});

Meteor.publish("users.detail", function(id: string) {
    return Users.find({ _id: id });
});