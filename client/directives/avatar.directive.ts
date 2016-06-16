import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';

@Directive({
    selector: '[avatar]'
})

export class AvatarDirective {

    private selector: any;
    private base: string = "/img/";

    @Input('avatar') set content(value: string) {
        let src = this.base + value;
        this.el.nativeElement.getAttributeNode("src").value = src;
    }

    constructor(public el: ElementRef, public renderer: Renderer) { }
}