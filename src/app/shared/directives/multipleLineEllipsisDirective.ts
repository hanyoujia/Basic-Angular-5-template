import { element } from 'protractor';
import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

/**
 *  Directive to truncate text and add placeholder at the end if
 *  it won't fit the div size.
 *  Notice: you have to set a fixed height on the html tag you are
 *  going to use this directive, otherwise it will case performace issue
 *  in IE11
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[tc-ellipsis]'
})
export class MultipleLineEllipsisDirective implements AfterViewInit {
    private el: ElementRef;
    private rawText: string;
    private placeHolder = '...';
    constructor(el: ElementRef) {
        this.el = el;
    }

    public ngAfterViewInit() {
        this.rawText = this.el.nativeElement.innerHTML;
        // delay 400ms for angualr to finish the render cycle.
        setTimeout(() => {
            this.truncateText(this.el);
        }, 400);
    }

    private truncateText(elementRef: ElementRef): void {
        const el = elementRef.nativeElement;
        const wordArray = this.rawText.split(' ');
        while (el.scrollHeight > el.offsetHeight) {
            wordArray.pop();
            el.innerHTML = wordArray.join(' ') + this.placeHolder;
        }
    }

    @HostListener('window:resize') onResize() {
        this.el.nativeElement.innerHTML = this.rawText;
        this.truncateText(this.el);
    }

    public reTruncate(): void {
        this.truncateText(this.el);
    }
}

