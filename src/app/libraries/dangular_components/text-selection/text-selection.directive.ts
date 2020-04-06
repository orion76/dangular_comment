import {Directive, ElementRef, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {ITextSelectionService, TEXT_SELECTION_SERVICE} from '@dangular-components/text-selection/types';

@Directive({selector: '[textSelection]'})
export class TextSelectionDirective implements OnInit {
  @Input() selectContext: any;

  constructor(
    @Inject(TEXT_SELECTION_SERVICE) private service: ITextSelectionService,
    private elRef: ElementRef,
    private  renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.listen(this.elRef.nativeElement, 'mousedown', (event) => {
      this.service.startSelect(event, this.elRef);
    });

    this.renderer.listen(this.elRef.nativeElement, 'mouseup', (event) => {
      setTimeout(() => {
        this.service.endSelect(event, this.elRef, this.selectContext);
      }, 100);

    });

  }
}
