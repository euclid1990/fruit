import {Directive, ElementRef, Renderer, Inject} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';

@Directive({
    selector: '[focus]'
})

export class FocusDirective {

    private selector: any;

    @Input('focus') set content(value: string) {
        this.el.nativeElement.focus();
    }

    constructor(@Inject(ElementRef) private el: ElementRef,
                @Inject(Renderer) public renderer: Renderer) {
    }
}