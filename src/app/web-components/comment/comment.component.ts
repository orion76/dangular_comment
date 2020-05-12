import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentService, ICommentStateService} from '../services/types';
import {Observable, Subscription} from 'rxjs';
import {IEntityUser, IUserService, USER_SERVICE} from '../services/user/types';
import {EntityComment, IEntityComment} from '../configs/entities/comment/comment--comment';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {ICommentAction, ICommentActionData} from './comment-actions.component';
import {createEntityOfJsonapiOne} from '@dangular-common/rxjs/operators';
import {EntityUser} from '../configs/entities/user/user--user';
import {map, switchMap} from 'rxjs/operators';


export type UCommentAction = 'edit' | 'reply' | 'collapse' | 'expand';
export type TCommentActions = { [key in UCommentAction]?: ICommentAction }

@Component({
  selector: 'comment',
  template: `
    <div *ngIf="comment$|async as comment" class="comment-content comment__content">
      <comment-author [user]="author$|async" class="comment-author comment-content__author"></comment-author>

      <!--EDIT-->
      <comment-form *ngIf="isFormEditOpen$|async; else comment_view" mode="edit" [comment_id]="comment_id"
                    class="comment-form comment-form-edit"></comment-form>
      <!--VIEW-->
      <ng-template #comment_view>
        <div class="comment__view comment-view">
          <comment-view [comment]="comment" class="comment-view__content">

          </comment-view>
          <comment-actions [comment_id]="comment_id" [data]="getCommentActionData()" class="comment-actions comment__actions"></comment-actions>
        </div>

      </ng-template>
    </div>
    <!--REPLY-->
    <comment-form *ngIf="isFormReplyOpen$|async" mode="reply" [parent_id]="comment_id" class="comment-form comment-form-reply">
      <comment-author formHeader [user]="loggedUser$|async" class="comment-author comment-content__author"></comment-author>
    </comment-form>

    <comment-list [parent_id]="comment_id" class="comment-children"></comment-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit, OnDestroy {

  formReplyId: number;
  formEditId: number;
  isFormEditOpen$: Observable<boolean>;
  isFormReplyOpen$: Observable<boolean>;
  @Input() comment_id: string;
  comment$: Observable<IEntityComment>;
  author$: Observable<IEntityUser>;
  loggedUser$: Observable<IEntityUser>;
  _subscriptions: Subscription[] = [];


  constructor(
    @Inject(USER_SERVICE) private user: IUserService,
    @Inject(COMMENT_SERVICE) private commentService: ICommentService,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(COMMENT_STATE_SERVICE) private stateService: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.comment$ = this.entities.getEntity<IEntityComment>(this.comment_id).pipe(createEntityOfJsonapiOne(EntityComment));

    this.author$ = this.comment$.pipe(
      map((comment) => comment.uid.id),
      switchMap((user_id) => this.entities.getEntity<IEntityUser>(user_id)),
      createEntityOfJsonapiOne(EntityUser)
    );

    this.loggedUser$ = this.user.currentUser();

    this.formReplyId = this.form.nextId();
    this.isFormReplyOpen$ = this.form.onFormOpen(this.formReplyId).pipe();

    this.formEditId = this.form.nextId();
    this.isFormEditOpen$ = this.form.onFormOpen(this.formEditId);
  }

  getCommentActionData(): ICommentActionData {
    const {formEditId, formReplyId} = this;

    return {formEditId, formReplyId};
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }


  debug(vars: any) {
    console.log('[debug] component', vars);
  }

}

