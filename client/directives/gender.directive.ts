import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {FEMALE, MALE} from './../../collections/users';

@Directive({
    selector: '[gender]'
})

export class GenderDirective {

    private selector: any;
    private src: string = "/img/female_avatar.png";

    @Input('gender') set content(value: string) {
        if (value == MALE) {
            this.src = "/img/male_avatar.png";
        }
        this.el.nativeElement.getAttributeNode("src").value = this.src;
    }

    constructor(public el: ElementRef, public renderer: Renderer) { }
}