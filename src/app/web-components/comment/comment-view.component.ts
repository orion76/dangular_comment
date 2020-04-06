import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IEntityComment} from '../configs/entities/comment/comment--comment';


@Component({
  selector: 'comment-view',
  template: `
    <comment-state [comment]="comment" class="comment__state"></comment-state>

    <comment-content [content]="comment.body.value" textSelection="comment" class="comment-content comment-content__text"></comment-content>


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



