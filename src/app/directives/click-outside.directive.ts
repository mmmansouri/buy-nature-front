import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[appClickOutside]',
  standalone: true, // Standalone directive
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {

    let clickedInside = this.elementRef.nativeElement.contains(targetElement);
    let targetElementChecker : HTMLElement | null;
    targetElementChecker = targetElement

    console.log(targetElementChecker)
    while(clickedInside == false && targetElementChecker != undefined) {
      clickedInside = this.elementRef.nativeElement.contains(targetElementChecker)
      targetElementChecker = targetElementChecker.parentElement
      console.log(clickedInside)
      console.log(targetElementChecker)
    }

    if (!clickedInside) {
       // this.clickOutside.emit();
    }

  }
}
