import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Injectable} from '@angular/core';
import {Control, ControlGroup} from '@angular/common';

interface ValidationResult {
    [key: string]: boolean;
}

@Injectable()
export class PasswordValidator {

    constructor() { }

    confirm(g: ControlGroup): ValidationResult {
        let last = null, valid = true;
        for (name in g.controls) {
            if (last !== g.controls[name].value && last !== null) {
                valid = false;
                break;
            }
            last = g.controls[name].value;
        }

        return valid ? null : { "confirm": true };
    }
}