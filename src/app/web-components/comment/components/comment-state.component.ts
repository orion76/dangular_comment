import {Component, Inject, Input, OnInit} from '@angular/core';
import {IUserService, USER_SERVICE} from '../../services/user/types';
import {Observable} from 'rxjs';
import {IEntityComment} from '../../configs/entities/comment/comment--comment';
import {IEntityVoteResUpdown} from '@dangular-components/vote/types';


@Component({
  selector: 'comment-state',
  template: `
    <vote-up-down *ngIf="comment"
                  [entity_id]="comment.id"
    ></vote-up-down>
  `,
  styles: [],
})
export class CommentStateComponent implements OnInit {
  @Input() comment: IEntityComment;
  vote: IEntityVoteResUpdown;
  voteEnabled$: Observable<boolean>;

  constructor(@Inject(USER_SERVICE) private user: IUserService) {
  }

  ngOnInit() {

    this.voteEnabled$ = this.user.hasPermission('vote[TODO]');
  }

}

