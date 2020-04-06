import {Component, OnInit, NgModule, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';

export type UTimerUpDown = 'up' | 'down';

@Component({
    selector: 'time-counter',
    template: `
      ({{current}})
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
  },
)
export class TimerComponent implements OnInit, OnDestroy {
  @Input() start;
  @Input() type: UTimerUpDown;
  @Input() end: number;
  @Output() onDone = new EventEmitter();
  public current: number;
  private step: number;
  private timerId: any;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    switch (this.type) {
      case 'up':
        this.step = 1;
        if (this.start === undefined) {
          this.start = 0;
        }

        if (this.start > this.end) {
          const {type, start} = this;
          console.error('[TimerComponent] count UP,Input [start] less than input [end]', {type, start});
        }
        break;
      case 'down':
        this.step = -1;
        if (this.end === undefined) {
          this.end = 0;
        }
        if (this.start < this.end) {
          const {type, start} = this;
          console.error('[TimerComponent] count DOWN, Input [start] more than input [end]', {type, start});
        }
        break;
    }

    this.start = Number(this.start);
    this.end = Number(this.end);

    this.current = this.start;
    this.tick();
  }

  tick() {
    this.timerId = setInterval(() => {

      this.current = this.current + this.step;

      if (this.current === this.end) {
        clearInterval(this.timerId);
        this.onDone.emit(true);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}


@NgModule({
  imports: [],
  exports: [TimerComponent],
  declarations: [TimerComponent],
  providers: [],
})
export class TimerModule {
}
