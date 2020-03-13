import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../services/types';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


@Component({
  selector: 'comment',
  template: `
    <div class="comment-content comment__content">
      <comment-author [user]="comment.uid" class="comment-author comment-content__author"></comment-author>

      <!--EDIT-->
      <div class="comment-form comment__edit">
        <comment-editor *ngIf="(edit$ | async); else comment_view" [content]="commentBody"
                        (onSave)="onSave($event)" (onCancel)="onCancel($event)"
                        class="comment-editor comment-form__editor"
        ></comment-editor>
      </div>
      <!--VIEW-->
      <ng-template #comment_view>
        <div class="comment__view">
          <comment-view [comment]="comment"></comment-view>
          <div class="comment-actions comment__actions">
            <a href="#" (click)="Edit()" class="comment-actions__button">Edit</a>
            <a href="#" (click)="Reply()" class="comment-actions__button">Reply</a>
          </div>
        </div>
      </ng-template>

    </div>
    <comment-list [parentId]="comment.id" class="comment-children"></comment-list>

  `,
  styleUrls: ['comment.component.scss']
})
export class CommentComponent implements OnInit {
  edit$: Observable<boolean>;

  @Input() comment: IEntityComment;
  commentBody: string;

  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
  ) {
  }

  ngOnInit() {
    this.edit$ = this.form.onOpenEdit(this.comment.id).pipe(
      tap(() => this.commentBody = this.comment.body),
      // tap((open) => {
      //     const action = open ? 'open' : 'close';
      //     console.log('[form state]', action, this.comment.id);
      //   }
      // )
    );
  }

  onSave(content: string) {
    debugger;
    this.service.saveUpdate(this.comment.id, content)
      .toPromise().then(() => {
      this.commentBody = '';
      this.form.openDefault();
    });
  }

  onCancel(content: string) {
    this.commentBody = '';
    this.form.openDefault();
  }

  Edit() {
    this.form.openEdit(this.comment.id);
  }

  Reply() {
    this.form.openCreate(this.comment.id);
  }
}

