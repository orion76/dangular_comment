import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IAppState} from '../state/IAppState';
import {Store} from '@ngrx/store';
import {IEntityComment} from './types';
import {IEntityUser} from '../services/user/types';
import {IEntityFile} from '../types';


@Component({
  selector: 'comment-view',
  template: `
    <comment-state class="comment__state"></comment-state>
    <div class="comment__content">
      <comment-author [user]="comment.uid" class="comment__author"></comment-author>
      <comment-content [content]="comment.body" class="comment__content"></comment-content>
    </div>
    <comment-actions></comment-actions>
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



