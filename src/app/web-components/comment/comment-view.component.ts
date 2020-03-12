import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';


@Component({
  selector: 'comment-view',
  template: `
    <comment-state class="comment__state"></comment-state>
    <div class="comment__content-block">
      <comment-author [user]="comment.uid" class="comment-author comment-content__author"></comment-author>
      <comment-content [content]="comment.body" class="comment-content comment-content__text"></comment-content>
    </div>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentViewComponent implements OnInit {

  @Input() comment: IEntityComment;

  constructor(private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
  }

}



