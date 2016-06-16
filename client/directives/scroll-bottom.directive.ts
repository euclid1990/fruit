import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {EmitterService} from '../services/emitter.service';

@Directive({
    selector: '[scrollBottom]'
})

export class ScrollBottomDirective {

    private selector: any;
    emitter: EventEmitter<any> = EmitterService.get('channel_scrollbottom');

    @Input('scrollBottom') set content(value: boolean) {
        window.setTimeout(() => {
            if (value) {
                this.autoscroll(this.selector);
            }
        }, 300);
    }

    constructor(el: ElementRef, renderer: Renderer) {
        let self = this;
        this.selector = $(el.nativeElement);
        this.autoscroll(this.selector);
    }

    autoscroll(selector: any) {
        selector.animate({ scrollTop: selector.prop('scrollHeight') }, 100);
    }
}