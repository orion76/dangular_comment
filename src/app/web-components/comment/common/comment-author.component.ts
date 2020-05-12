import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IEntityUser} from '../../services/user/types';


@Component({
  selector: 'comment-author',
  template: `
    <img [src]="user.avatar" [alt]="user.label" class="comment-author__avatar"/>
    <div class="comment-author__name">{{user.label}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentAuthorComponent implements OnInit {
  @Input() user: IEntityUser;

  constructor() {
  }


  ngOnInit() {

  }

}


