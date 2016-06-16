import {Meteor} from 'meteor/meteor';
import {Messages} from './../../collections/messages';
import {Counts} from 'meteor/tmeasday:publish-counts';
import * as Helpers from "./../../lib/helpers";

Meteor.publish("messages.all", function(conditions: Object, options: Object) {
    Counts.publish(this, "messages.total", Messages.find(conditions), { noReady: true });
    let secure = {
        fields: {
            "userId": 1,
            "targetId": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "content": 1
        }
    }
    options = Helpers.mergeOptions(options, secure);
    return Messages.find(conditions, options);
});