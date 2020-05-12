import {ChangeDetectionStrategy, Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {IUserService, USER_SERVICE} from '../../services/user/types';
import {Observable} from 'rxjs';
import {IEntityComment} from '../../configs/entities/comment/comment--comment';
import {IEntityVoteResUpdown} from '@dangular-components/vote/types';
import {DateAgo} from '@dangular-common/pipes/date-ago/date-ago.pipe';


@Component({
  selector: 'comment-state',
  template: `
    <span class="comment-id"><b>id:</b>{{formatId(comment)}}</span>
    <span *ngIf="created" class="comment-state__item comment-date comment-date-created">{{created}}</span>
    <span *ngIf="changed" class="comment-state__item comment-date comment-date-changed">{{changed}}</span>
<!--    <vote-up-down *ngIf="comment" [entity_id]="comment.id" class="comment-state__item "></vote-up-down>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentStateComponent implements OnInit {
  @Input() comment: IEntityComment;
  vote: IEntityVoteResUpdown;
  voteEnabled$: Observable<boolean>;
  created: string;
  changed: string;

  constructor(@Inject(USER_SERVICE) private user: IUserService) {
  }

  @HostBinding('class.comment-state') blockClass=true;
  // get blockClass() {
  //   return true;
  // }

  ngOnInit() {

    this.voteEnabled$ = this.user.hasPermission('vote[TODO]');
    this.formatDates();
  }

  formatId(comment: IEntityComment) {
    return comment ? comment.id.slice(0, comment.id.indexOf('-')) : 'undefined';
  }

  formatDates() {

    if (this.comment.created !== this.comment.changed) {
      this.changed = DateAgo(this.comment.changed);
    } else {
      this.created = DateAgo(this.comment.created);
    }
  }


}

