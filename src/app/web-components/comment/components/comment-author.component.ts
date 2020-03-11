import {Component, Input, OnInit} from '@angular/core';
import {IEntityUser} from '../../services/user/types';


@Component({
  selector: 'comment-author',
  template: `
    <img [src]="user.user_picture.url" [alt]="user.label"/>
    <div class="user-name">{{user.label}}</div>
  `,
  styles: [],
})
export class CommentAuthorComponent implements OnInit {
  @Input() user:IEntityUser;


  constructor() {
  }

  ngOnInit() {
  }

}


