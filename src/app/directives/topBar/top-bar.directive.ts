import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTopBar]'
})
export class TopBarDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('ionScroll', ['']) onScroll(e:any){
    const scrollPosition = window.scrollY;
    console.log(scrollPosition);
    scrollPosition > 0 
    ? this.renderer.addClass(this.el.nativeElement, 'ion-no-border')
    : this.renderer.removeClass(this.el.nativeElement, 'ion-no-border')
  }

}
