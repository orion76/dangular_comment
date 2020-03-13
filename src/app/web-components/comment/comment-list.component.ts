import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {Observable} from 'rxjs';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../services/types';
import {IEntityUser, IUserService, USER_SERVICE} from '../services/user/types';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'comment-list',
  template: `
    <!-- FOR ROOT  -->
    <div class="comment-form" *ngIf="isRoot; else child">
      <comment-author *ngIf="loggedUser$ | async as user" [user]="user"
                      class="comment-author comment-form__author">
      </comment-author>

      <!-- can Disable -->
      <comment-editor [isDisabled]="!(openForm$ | async)" (onSave)="onSave($event)" (onCancel)="onCancel($event)"
                      [content]="commentContent"
                      class="comment-editor comment-form__editor"
      ></comment-editor>
    </div>

    <ng-template #child>
      <!-- FOR CHILD-->
      <div *ngIf="openForm$ | async" class="comment-form">
        <comment-author *ngIf="loggedUser$ | async as user" [user]="user"
                        class="comment-author comment-form__author">
        </comment-author>
        <!-- can Hide -->
        <comment-editor  (onSave)="onSave($event)" (onCancel)="onCancel($event)"
                        class="comment-editor comment-form__editor"
        ></comment-editor>
      </div>
    </ng-template>

    <comment *ngFor="let comment of items$|async; trackBy:trackByCommentId " [comment]="comment" class="comment"></comment>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit {
  openForm$: Observable<boolean>;
  @Input() entity_type: string;
  @Input() entity_id: string;
  commentContent: string;
  @Input() parentId: string;

  isRoot = false;
  loggedUser$: Observable<IEntityUser>;
  items$: Observable<IEntityComment[]>;

  constructor(@Inject(USER_SERVICE) private user: IUserService,
              @Inject(COMMENT_SERVICE) private service: ICommentService,
              @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
              private cdr: ChangeDetectorRef) {
  }

  onSave(content: string) {
    this.service.saveNew(this.parentId, content)
      .toPromise().then(() => {
      this.form.openDefault();
      this.commentContent = '';
    });
  }

  onCancel(content: string) {
    this.commentContent = '';
    this.form.openDefault();
  }


  trackByCommentId(index: number, comment: IEntityComment): string {
    return comment.id;
  }

  ngOnInit() {
    if (!this.parentId && this.entity_id) {
      if (!this.entity_id) {
        console.error('Missing parentId and entity_id');
      }
      this.parentId = this.entity_id;
    }


    this.items$ = this.service.getChildren(this.parentId);
    this.loggedUser$ = this.user.loggedUser();
    this.initEntity();
    this.openForm$ = this.form.onOpenCreate(this.parentId);
    this.cdr.detectChanges();
  }

  initEntity() {
    if (this.entity_id) {
      this.isRoot = true;
      const entity = {id: this.entity_id, type: this.entity_type};
      this.service.setEntity(entity);
      this.form.setDefault(this.parentId, 'create');
      this.form.openDefault();
    }
  }

}
