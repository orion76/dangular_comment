import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';


@Component({
  selector: 'comment-view',
  template: `
    <comment-state class="comment__state"></comment-state>

    <comment-content [content]="comment.body.value" class="comment-content comment-content__text"></comment-content>


  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentViewComponent implements OnInit {
  @Input() comment:IEntityComment;

  constructor(private cdr: ChangeDetectorRef) {
  }


  ngOnInit() {
  }

}



