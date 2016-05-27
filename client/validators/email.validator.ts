import 'reflect-metadata';
import 'zone.js/dist/zone';
import './../rxjs-operators';
import {Observable} from 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Control} from '@angular/common';
import {Accounts} from 'meteor/accounts-base';
import {Users} from './../../collections/users';
import {Meteor} from 'meteor/meteor';

// General Email Regex (RFC 5322 Official Standard)
const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

interface ValidationResult {
    [key: string]: boolean;
}

@Injectable()
export class EmailValidator {

    constructor() {
        // Email has already been taken
        // By default, Meteor only publishes the logged in user and you can, as you mention, run queries against that user.
        // In order to access the other users you have to publish them on the server:
        Meteor.subscribe("users.all");
    }

    format(c: Control): ValidationResult {
        return EMAIL_REGEXP.test(c.value) ? null : { "format": true };
    }

    taken(c: Control): Promise<ValidationResult> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let user = Meteor.users.findOne({
                    emails: {
                        $elemMatch: {
                            address: c.value
                        }
                    }
                });
                if (user) {
                    resolve({ "taken": true })
                } else {
                    resolve(null);
                };
            }, 1000);
        });
    }
}