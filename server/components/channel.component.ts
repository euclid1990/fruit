import {Meteor} from 'meteor/meteor';
import {Channels} from './../../collections/channels';
import {Counts} from 'meteor/tmeasday:publish-counts';
import * as Helpers from "./../../lib/helpers";

Meteor.publish("channels.all", function(options: Object, userId: string) {
    let conditions = {
        $or: [
            { "fromId": userId },
            { "targetId": userId }
        ]
    };
    Counts.publish(this, "channels.total", Channels.find(conditions), { noReady: true });
    let secure = {
        fields: {
            "fromId": 1,
            "fromName": 1,
            "fromAvatar": 1,
            "targetId": 1,
            "targetName": 1,
            "targetAvatar": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "message": 1
        }
    }
    options = Helpers.mergeOptions(options, secure);
    return Channels.find(conditions, options);
});

Meteor.publish("channels.one", function(conditions: Object, options: Object) {
    let secure = {
        fields: {
            "fromId": 1,
            "fromName": 1,
            "fromAvatar": 1,
            "targetId": 1,
            "targetName": 1,
            "targetAvatar": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "message": 1
        }
    }
    options = Helpers.mergeOptions(options, secure);
    return Channels.find(conditions, options);
});