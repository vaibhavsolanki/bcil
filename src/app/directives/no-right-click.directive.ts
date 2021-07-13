import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoRightClick]'
})
export class NoRightClickDirective {
  constructor() { }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: any): void {
    event.preventDefault();
  }
}
