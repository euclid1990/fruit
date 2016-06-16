import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export interface IChannel {
    _id?: string;
    fromId: string;
    fromName: string;
    fromAvatar: string;
    targetId: string;
    targetName: string;
    targetAvatar: string;
    createdAt: number;
    updatedAt: number;
    message: string;
}

export function channelInitialize(fromId: string, fromName: string, fromAvatar: string,
                                targetId: string, targetName: string, targetAvatar: string,
                                message: string) {
    return Object.create({
        fromId: fromId,
        fromName: fromName,
        fromAvatar: fromAvatar,
        targetId: targetId,
        targetName: targetName,
        targetAvatar: targetAvatar,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        message: message,
    });
}

export let Channels = new Mongo.Collection<IChannel>('channels');

Channels.allow({
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