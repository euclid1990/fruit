import {Meteor} from 'meteor/meteor';
import {Users} from './../../collections/users';

Meteor.publish("users.all", function () {
    return Users.find({});
});