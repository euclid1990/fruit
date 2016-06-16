import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export interface Gender {
    name: string;
    value: string;
}

export const AVATARS = ["apple.png", "orange.png", "pineapple.png", "tomato.png", "watermelon.png",
                        "banana.png", "cherry.png", "grape.png", "pear.png", "mangosteen.png"];

export const FEMALE = 'F';

export const MALE = 'M';

export const GENDERS: Array<Gender> = [
    { name: 'Female', value: 'F' },
    { name: 'Male', value: 'M' }
];

export function idTransform(item) {
    // Add id attribute
    item.id = item._id;
    return item;
}

export function genderTransform(item) {
    let gender = GENDERS.filter((e) => {
        return item.profile.gender === e.value;
    });
    // Add genderName attribute
    item.profile.genderName = gender.shift().name;
    return item;
}

export function emailTransform(item) {
    if (typeof item !== 'undefined' &&
        typeof item.emails !== 'undefined') {
        // Add email attribute
        item.profile.email = item.emails[0].address;
    }
    return item;
}

export function userTransform(item) {
    item = idTransform(item);
    item = genderTransform(item);
    item = emailTransform(item);
    return item;
}

export type User = {
    email: string;
    password: string;
    profile: {
        name: string;
        gender: string;
        avatar: string;
    };
}

export interface IUser {
    _id?: string;
    createdAt: number,
    profile: {
        name: string;
        gender: string;
        genderName: string;
        email: string;
        avatar: string;
    };
}

export function userInitialize() {
    return Object.create({
        profile: Object.create({
            name: null,
            gender: null,
            genderName: null,
            email: null,
            avatar: null,
        })
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