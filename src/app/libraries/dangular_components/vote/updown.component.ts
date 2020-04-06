import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {IVoteService, TUpdownState, VOTE_SERVICE} from '@dangular-components/vote/types';
import {Subscription} from 'rxjs';


@Component({
  selector: 'vote-up-down',
  template: `
    <span class="vote-up-down">
      <button class="vote-up-down__up" [disabled]="disableUp()" (click)="up()"><i class="fa fa-thumbs-up"></i></button>
      <span class="vote-up-down__value_sum">{{sum}}</span>
      <button class="vote-up-down__down" [disabled]="disableDown()" (click)="down()"><i class="fa fa-thumbs-down"></i></button>
     </span>
  `
})
export class VoteUpDownComponent implements OnInit, OnDestroy {
  @Input() entity_id: string;
  @Output() onChange = new EventEmitter();
  stateSub: Subscription;
  enabled: boolean;
  sum: number;
  vote: number;

  constructor(@Inject(VOTE_SERVICE) private service: IVoteService) {
  }

  ngOnInit() {
    this.stateSub = this.service.get(this.entity_id).subscribe((state:TUpdownState) => {
      if (state) {
        this.enabled = state.enabled;
        this.sum = state.vote_result.sum;
        this.vote = state.user_vote ? state.user_vote.value : 0;
      } else {
        this.sum = 0;
        this.vote = 0;
      }

    });
  }

  ngOnDestroy(): void {
    this.stateSub.unsubscribe();
  }

  disableDown() {
    return !this.enabled || this.vote < 0;
  }

  disableUp() {
    return !this.enabled || this.vote > 0;
  };


  up() {
    this.service.set(this.entity_id, this.calculateValue(this.vote, 'up'));
  }

  down() {
    this.service.set(this.entity_id, this.calculateValue(this.vote, 'down'));
  }

  calculateValue(current: number, action: 'up' | 'down') {
    switch (action) {
      case 'up':
        current++;
        break;
      case 'down':
        current--;
        break;
    }
    return current;
  }

}
