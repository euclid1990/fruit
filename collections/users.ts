import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export interface Gender {
    name: string;
    value: string;
}

export const GENDERS: Array<Gender> = [
    { name: 'Female', value: 'F' },
    { name: 'Male', value: 'M' }
];

export type User = {
    email: string;
    password: string;
    profile: {
        name: string;
        gender: string;
    };
}

export function userInitialize() {
    return Object.create({
        profile: Object.create(null)
    });
}

export let Users = Meteor.users;

Users.allow({
    update: function(userId, user) {
        return user._id == userId;
    },
    insert: function(userId, user) {
        return true;
    }
});