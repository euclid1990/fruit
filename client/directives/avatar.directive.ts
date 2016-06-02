import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {FEMALE, MALE} from './../../collections/users';

@Directive({
    selector: '[avatar]'
})

export class AvatarDirective {

    private selector: any;
    private gender: string;

    @Input('avatar') set content(value: string) {
        this.gender = value;
    }

    constructor(el: ElementRef, renderer: Renderer) {
        let src = '/img/female_avatar.png';
        if (this.gender == MALE) {
            src = '/img/male_avatar.png';
        }
        el.nativeElement.getAttributeNode("src").value = src;
    }
}