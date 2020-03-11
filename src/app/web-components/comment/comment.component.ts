import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {COMMENT_SERVICE, ICommentService} from '../services/types';
import {IEntityUser} from '../services/user/types';
import {IEntityFile} from '../types';

@Component({
  selector: 'comment',
  template: `
    <comment-view *ngIf="!edit" [comment]="comment"></comment-view>
    <comment-form *ngIf="edit" [commentId]="comment.id" mode="edit"></comment-form>

    <comment-list [parentId]="comment.id" class="comment-children"></comment-list>

  `,
  styleUrls: ['comment.component.scss']
})
export class CommentComponent implements OnInit {
  edit: boolean;

  @Input() comment: IEntityComment;
  @Input() author: IEntityUser;
  @Input() avatar: IEntityFile;
  @HostBinding('class') public selfClass: string;

  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService) {
  }

  ngOnInit() {
    this.selfClass = 'comment';
  }

}

