import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export type User = {
    name: string;
    password: string;
    email: string;
}

export let Users = new Mongo.Collection('users');