import {Component, OnInit, NgModule, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {IActionTimer} from '../../../web-components/comment/comment-actions.component';

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

  @Input() timer: IActionTimer;

  public current: number;
  private step: number;
  private timerId: any;

  constructor(private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
    const {timer} = this;
    switch (timer.type) {
      case 'up':
        this.initCounterUp(timer);
        break;
      case 'down':
        this.initCounterDown(timer);
        break;
    }

    timer.start = Number(timer.start);
    timer.end = Number(timer.end);

    this.current = timer.start;
    this.timerId = this.timerStart();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  initCounterDown(timer: IActionTimer) {
    this.step = -1;
    if (timer.end === undefined) {
      timer.end = 0;
    }
    if (timer.start < timer.end) {
      console.error('[TimerComponent] count DOWN, Input [start] more than input [end]', timer);
    }
  }

  initCounterUp(timer: IActionTimer) {
    this.step = 1;
    if (timer.start === undefined) {
      timer.start = 0;
    }

    if (timer.start > timer.end) {
      console.error('[TimerComponent] count UP,Input [start] less than input [end]', timer);
    }
  }

  timerStart() {
    return setInterval(() => {

      this.current = this.current + this.step;

      if (this.current === this.timer.end) {
        clearInterval(this.timerId);
        this.timer.onComplete();
      }
      this.cdr.detectChanges();
    }, 1000);
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
