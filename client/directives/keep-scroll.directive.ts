import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {EmitterService} from '../services/emitter.service';

@Directive({
    selector: '[keepScroll]'
})

export class KeepScrollDirective {

    private selector: any;

    @Input('keepScroll') set content(container: any) {
        container.scrollTop = container.scrollTop + this.el.nativeElement.clientHeight + 20;
    }

    constructor(private el: ElementRef, renderer: Renderer) {
        let self = this;
        this.selector = $(el.nativeElement);
    }
}