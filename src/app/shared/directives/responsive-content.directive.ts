import { Directive, OnInit, ElementRef, Input, OnDestroy, EventEmitter, Output } from '@angular/core';

// tslint:disable:no-var-requires

/**
 * Directive to add classes to an element based on its usable width (excludes padding).
 * This allows descendants to behave responsively relative to the width of that element
 * instead of the viewport width (which CSS media queries use).
 * Optionally, a name can be given to each state. When the element's width enters the range
 * of a state, the state's name will be emitted from the "(responsiveState)" output.
 *
 * Usage (class only):
 * 	<div [tc-responsive-content]="[{min: '0px', className: 'tc-class-1'},
 * 								{min: '500px', className: 'tc-class-2'}]">
 *
 * Usage (class and event):
 * 	<div [tc-responsive-content]="[{name: 'small', min: '0px', className: 'tc-class-1'},
 * 								{name: 'large', min: '500px', className: 'tc-class-2'}]"
 * 		(responsiveState)="myStateChangeHandler($event)">
 *
 * Limitations:
 *  - Cannot be used on elements that may have "display: none" when constructed
 * 		(result of https://github.com/marcj/css-element-queries/issues/46)
 */
@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[tc-responsive-content]'
})
export class ResponsiveContentDirective implements OnInit, OnDestroy {

	/**
	 * Array defining the classes and breakpoints to use.
	 * Must be an array of objects each having "min" and "className" string members.
	 */
	// tslint:disable:no-input-rename
	@Input('tc-responsive-content') public initializers: StateInitializer[];

	/**
	 * Emits the index of the state that is currently active
	 */
	@Output() public responsiveState = new EventEmitter<string>();

	public theElement: any;
	private sensor: any;
	private responsiveStates: ResponsiveState[] = [];
	private currentStateIndex = -1;
	private jQuery: any = require('jquery');
	private elementResizeDetectorMaker = require('element-resize-detector');
	private erd: any;
	constructor(private element: ElementRef) {
		this.theElement = this.element.nativeElement;
		this.erd = this.elementResizeDetectorMaker();
	}

	public ngOnInit() {

		// console.log('ngOninit called...')
		// Convert the intitializer array into an array of ResponsiveStates
		// tslint:disable-next-line:prefer-const
		let params = this.initializers;
		// Sort initializers to smallest-min-first
		params.sort((a, b) => this.getMinWidth(a) - this.getMinWidth(b));
		let min = 0;
		let stateName: string = null;
		let classNames: string[] = [];
		for (const param of params) {
			const currentWidth = this.getMinWidth(param);
			// If multiple objects specify the same min width, use class names from all of them for a single responsive state
			// TODO: what about the state name?
			if (currentWidth !== min) {
				if (classNames.length > 0) {
					this.responsiveStates.push(new ResponsiveState(stateName, classNames, min, currentWidth));
					classNames = [];
					stateName = null;
				}
				min = currentWidth;
			}
			// Allow a space-separated list of classes to be specified in each initializer object
			if (param.className) {
				param.className.split(' ').forEach((name) => classNames.push(name));
			}
			if (param.name != null) {
				stateName = param.name;
			}
		}
		// The last class name should be used for all higher widths
		if (classNames.length > 0) {
			// Use null to represent infinity
			this.responsiveStates.push(new ResponsiveState(stateName, classNames, min, null));
		} else {
			// tslint:disable-next-line:no-console
			console.info('no classNames to apply based on resizing');
			return;
		}

		// tslint:disable-next-line:prefer-const
		let determineState = () => {
			const newStateIndex = this.responsiveStates.findIndex((state) => state.doesStateApply(this.element.nativeElement));
			if (newStateIndex === this.currentStateIndex) {
				// Don't do anything if the state hasn't changed.
				return;
			}

			// It is possible for responsive states to have overlapping classes.
			// Because of this, we need do removal of classes before adding classes,
			// so that an inactive state doesn't undo anything added by an active state.
			this.responsiveStates
				.filter((state, index) => index !== newStateIndex)
				.forEach((state) => state.pruneClasses(this.element.nativeElement));
			if (newStateIndex !== -1) {
				this.responsiveStates[newStateIndex].applyClasses(this.element.nativeElement);
			}

			this.currentStateIndex = newStateIndex;
			this.responsiveState.emit(newStateIndex === -1 ? null : this.responsiveStates[newStateIndex].stateName);
		};

		const that = this;

		determineState();
		this.erd.listenTo(this.theElement, () => {
			if (typeof that.theElement.recLastWidth !== 'undefined' &&
				that.theElement.recLastWidth === that.jQuery(that.theElement).width()) {
				return;
			}
			that.theElement.recLastWidth = that.jQuery(that.theElement).width();
			determineState();
		});
	}

	public ngOnDestroy() {
	}

	private isWidth(input: string) {
		input = input.trim();
		if (/^\d+(px)?$/.test(input)) {
			return true;
		}
		// TODO: some day it would be nice to support ems/rems.
		if (/^\d+r?em$/.test(input)) {
			console.error(`tc-responsive-content directive passed unsupported width format (${input}). `
				+ `Width will be interpreted as pixels.`);
			return true;
		}

		return false;
	}

	private getMinWidth(initializer: StateInitializer) {
		const width = initializer.min.trim();

		if (!this.isWidth(width)) {
			// TODO: since this method is used for sorting, this error will spam the console if an invalid width is passed.
			// Workaround: use valid width!
			console.error(`tc-responsive-content directive passed illegal min width (${width}). `
				+ `Width will be interpreted as 0.`);
			return 0;
		}

		// parseInt stops parsing when it gets to a non-digit, so "px" suffix will be ignored
		return parseInt(width, 10);
	}

}


/**
 * Internal class used to keep track of classes and breakpoints
 */
class ResponsiveState {
	constructor(
		public stateName: string,
		public classNames: string[],
		public minWidth: number,
		public maxWidth: number
	) { }

	/**
	 * Remove the classes for this responsive state from the given element if this state does not apply based on its width
	 * @param element Element whose classes are to be changed based on its width
	 */
	public pruneClasses(element: Element) {
		// Remove the associated class(es) for this state.
		this.classNames.forEach((className) => element.classList.remove(className));
	}

	/**
	 * Add the classes for this responsive state to the given element
	 * @param element Element whose classes are to be changed
	 */
	public applyClasses(element: Element) {
		// Add the associated class(es)
		this.classNames.forEach((className) => element.classList.add(className));
	}

	/**
	 * Checks if this state applies to the given element base on its width
	 * @param element Element whose width should be checked
	 */
	public doesStateApply(element: Element): boolean {
		// Get width excluding padding (assumes element display is NOT inline)
		const availableWidth = parseInt(window.getComputedStyle(element, null).getPropertyValue('width'), 10);
		// Minimum width is inclusive and maximum is exlusive.
		return availableWidth >= this.minWidth && (this.maxWidth == null || availableWidth < this.maxWidth);
	}
}

/**
 * Internal class used for input passed in from template
 */
class StateInitializer {
	constructor(public className: string, public min: string, public name?: string) { }
}
