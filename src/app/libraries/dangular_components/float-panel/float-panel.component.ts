import {AfterViewInit, Component, ElementRef, Input, NgModule, NgZone, OnDestroy, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from 'primeng/dom';
import {Observable, Subscription} from 'rxjs';

export interface ICoordinate {
  pageX: number;
  pageY: number;
}

@Component({
  selector: 'float-panel',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['float-panel.scss']
})
export class FloatPanelComponent implements AfterViewInit, OnDestroy {
  @Input() onShow: Observable<ICoordinate>;

  @Input() appendTo: any;

  @Input() autoZIndex: boolean = true;

  @Input() baseZIndex: number = 0;

  documentClickListener: any;

  windowResizeListener: any;

  triggerEventListener: any;

  subscriptions: Subscription[] = [];

  constructor(public el: ElementRef, public renderer: Renderer2, public zone: NgZone) {
  }

  ngAfterViewInit() {

    if (this.appendTo) {
      if (this.appendTo === 'body') {
        document.body.appendChild(this.el.nativeElement);
      } else {
        DomHandler.appendChild(this.el.nativeElement, this.appendTo);
      }
    }

    this.subscriptions.push(this.onShow.subscribe((coordinate) => {
      if (coordinate) {
        this.show(coordinate);
      } else {
        this.hide();
      }
    }));
  }

  show(coordinate: ICoordinate) {
    this.position(coordinate);
    this.moveOnTop();
    this.el.nativeElement.style.display = 'block';
    DomHandler.fadeIn(this.el.nativeElement, 250);
    this.bindGlobalListeners();

  }

  hide() {
    this.el.nativeElement.style.display = 'none';
    this.unbindGlobalListeners();
  }

  moveOnTop() {
    if (this.autoZIndex) {
      this.el.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
    }
  }

  position(coordinate: ICoordinate) {

    let left = coordinate.pageX + 1;
    let top = coordinate.pageY + 1;
    let width = this.el.nativeElement.offsetParent ? this.el.nativeElement.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.el.nativeElement);
    let height = this.el.nativeElement.offsetParent ? this.el.nativeElement.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.el.nativeElement);
    let viewport = DomHandler.getViewport();

    //flip
    if (left + width - document.body.scrollLeft > viewport.width) {
      left -= width;
    }

    //flip
    if (top + height - document.body.scrollTop > viewport.height) {
      top -= height;
    }

    //fit
    if (left < document.body.scrollLeft) {
      left = document.body.scrollLeft;
    }

    //fit
    if (top < document.body.scrollTop) {
      top = document.body.scrollTop;
    }

    this.el.nativeElement.style.left = left + 'px';
    this.el.nativeElement.style.top = top + 'px';

  }

  bindGlobalListeners() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
        if (this.el.nativeElement.offsetParent && event.button !== 2) {
          this.hide();
        }
      });
    }

    this.zone.runOutsideAngular(() => {
      if (!this.windowResizeListener) {
        this.windowResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.windowResizeListener);
      }
    });
  }

  unbindGlobalListeners() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }

    if (this.windowResizeListener) {
      window.removeEventListener('resize', this.windowResizeListener);
      this.windowResizeListener = null;
    }
  }

  onWindowResize(event) {
    if (this.el.nativeElement.offsetParent) {
      this.hide();
    }
  }

  ngOnDestroy() {
    this.unbindGlobalListeners();

    if (this.triggerEventListener) {
      this.triggerEventListener();
    }

    if (this.appendTo) {
      this.el.nativeElement.appendChild(this.el.nativeElement);
    }

    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

}

@NgModule({
  imports: [CommonModule],
  exports: [FloatPanelComponent],
  declarations: [FloatPanelComponent]
})
export class FloatPanelModule {
}
