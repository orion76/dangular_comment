import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../services/types';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


@Component({
  selector: 'comment',
  template: `
    <div *ngIf="!(edit$ | async)" class="comment__view">
      <comment-view [comment]="comment"></comment-view>
      <div class="comment__actions">
        <button (click)="Edit()">Edit</button>
        <button (click)="Reply()">Reply</button>
      </div>
    </div>
    <comment-form *ngIf="(edit$ | async)" [content]="comment.body" (onSave)="onSave($event)" (onCancel)="onCancel($event)"></comment-form>

    <comment-list [parentId]="comment.id" class="comment-children"></comment-list>

  `,
  styleUrls: ['comment.component.scss']
})
export class CommentComponent implements OnInit {
  edit$: Observable<boolean>;

  @Input() comment: IEntityComment;

  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
  ) {
  }

  ngOnInit() {
    this.edit$ = this.form.onOpenEdit(this.comment.id).pipe(
      tap((open) => {
          const action = open ? 'open' : 'close';
          console.log('[form state]', action, this.comment.id);
        }
      )
    );
  }

  onSave(content: string) {
    debugger;
    this.service.saveUpdate(this.comment.id, content)
      .toPromise().then(() => {
      this.form.openDefault();
    });
  }

  onCancel(content: string) {
    this.form.openDefault();
  }

  Edit() {
    this.form.openEdit(this.comment.id);
  }

  Reply() {

  }
}

