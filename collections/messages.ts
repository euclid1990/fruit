import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export interface IMessage {
    _id?: string;
    channelId: string;
    userId: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export function messageInitialize(channelId: string, userId: string, content: string) {
    return Object.create({
        channelId: channelId,
        userId: userId,
        content: content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
}

export let Messages = new Mongo.Collection<IMessage>('messages');

Messages.allow({
    update: function(userId, user) {
        // return user._id == userId;
        return true;
    },
    insert: function(userId, user) {
        return true;
    },
    remove: function(userId, user) {
        return user._id == userId;
    }
});