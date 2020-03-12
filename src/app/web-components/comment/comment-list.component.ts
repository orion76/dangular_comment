import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {Observable} from 'rxjs';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../services/types';
import {IEntityUser, IUserService, USER_SERVICE} from '../services/user/types';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'comment-list',
  template: `
    <div class="comment-form-root" *ngIf="isRoot; else child">
      <comment-author *ngIf="loggedUser$ | async as user" [user]="user"
                      class="comment-author comment-form-root__author">
      </comment-author>
      <comment-form [isDisabled]="!(openForm$ | async)" (onSave)="onSave($event)" (onCancel)="onCancel($event)"
                    class="comment-form comment-form-root__form"
      ></comment-form>
    </div>
    <ng-template #child>
      <comment-form *ngIf="openForm$ | async" (onSave)="onSave($event)" (onCancel)="onCancel($event)"></comment-form>
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
    });
  }

  onCancel(content: string) {
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
    this.openForm$ = this.form.onOpenCreate(this.parentId).pipe(
      tap((open) => {
        const action = open ? 'open' : 'close';
        console.log('[form state]', action, this.parentId);
      })
    );
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
