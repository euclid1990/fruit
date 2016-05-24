import {Directive, ElementRef, Renderer} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {EmitterService} from './../services/emitter.service';

@Directive({
    selector: '[openSearch]',
    host: {
        '(click)': 'onClick($event)'
    }
})

export class OpenSearchDirective {

    private selector: any;
    private searchForm: any;
    emitter: EventEmitter<any> = EmitterService.get('channel_search');

    @Input('openSearch') set content(value: any) {
        this.searchForm = $(value);
    }

    constructor(el: ElementRef, renderer: Renderer) {
        this.selector = $(el.nativeElement);
    }

    ngOnInit() {
        let self = this;
        this.searchForm.on('click keyup', function(event) {
            console.log(event.keyCode);
            if (event.target == this || event.keyCode == 27) {
                self.closeSearch();
            }
        });
        this.searchForm.find('button.search-close').first().on('click', (event) => {
            this.closeSearch();
        });
    }

    onClick($event) {
        $event.preventDefault();
        this.searchForm.addClass('search-open');
        this.searchForm.find('input[type="search"]').first().focus();
    }

    closeSearch() {
        this.searchForm.removeClass('search-open');
    }
}