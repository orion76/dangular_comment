import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentService, ICommentStateService} from '../services/types';
import {Observable, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map, share, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {ICommentNode} from '../state/comment_tree/reducer';
import {IUserService, USER_SERVICE} from '../services/user/types';
import {ICommentState} from '../state/comment_state/reducer';
import {IEntityComment} from '../configs/entities/comment/comment--comment';
import {ITextSelectionService, TEXT_SELECTION_SERVICE} from '@dangular-components/text-selection/types';


@Component({
  selector: 'comment',
  template: `

    <div *ngIf="(comment$|async) as comment">

      <div class="comment-content comment__content">
        <comment-author [user]="comment.uid" class="comment-author comment-content__author"></comment-author>

        <!--EDIT-->

        <comment-form-edit *ngIf="edit$|async; else comment_view" [comment]="comment"
                           class="comment-form comment-form-edit"></comment-form-edit>


        <!--VIEW-->
        <ng-template #comment_view>
          <div class="comment__view">
            <comment-view [comment]="comment"></comment-view>
            <div class="comment-actions comment__actions">

              <button *ngIf="editable$|async" (click)="Edit()" class="comment-actions__button">
                <time-counter type="down" [start]="time_edit" (onDone)="onEditDenied()"></time-counter>
                {{'edit'|translate}}
              </button>
              <button *ngIf="canReply$|async" (click)="Reply()" class="comment-actions__button">{{'reply'|translate}}</button>

              <ng-container *ngIf="comment.child_count">
                <button *ngIf="(state$|async)?.children; else collapsed"
                        (click)="Collapse()" class="comment-actions__button">{{'collapse'|translate}}({{comment.child_count}})
                </button>
                <ng-template #collapsed>
                  <button
                    (click)="Expand()" class="comment-actions__button">{{'expand'|translate}}({{comment.child_count}})
                  </button>
                </ng-template>

              </ng-container>

            </div>
          </div>
        </ng-template>
      </div>
      <comment-form-reply *ngIf="reply$|async" [parent]="comment"
                          class="comment-form comment-form-reply"
      ></comment-form-reply>
    </div>

    <comment-list [parent_id]="id" class="comment-children"></comment-list>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {
  editable$: Observable<boolean>;
  canReply$: Observable<boolean>;
  edit$: Observable<boolean>;
  reply$: Observable<boolean>;
  state$: Observable<ICommentNode>;
  comment$: Observable<IEntityComment>;
  commentState$: Observable<ICommentState>;

  _subscriptions: Subscription[] = [];

  id: string;
  @Input() time_edit = 300;
  @Input() comment_id: string;

  @Input() entity_type: string;
  @Input() entity_id: string;
  @Input() field_name: string;
  commentBody: string;


  constructor(
    @Inject(USER_SERVICE) private user: IUserService,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.initComment();
    this.state$ = this.state.commentState(this.id);

    this.form.isOpen().subscribe();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onEditDenied() {
    this.state.setEditable(this.id, false);
  }

  debug(vars: any) {
    console.log('[debug] component', vars);
  }


  isNew() {
    return !this.comment_id;
  }

  initComment() {

    this.id = this.comment_id;
    this.comment$ = this.state.getComment(this.comment_id);
    this.commentState$ = this.state.getCommentState(this.comment_id).pipe(filter(Boolean), share());

    this.editable$ = this.user.hasPermission('reply[TODO]').pipe(
      switchMap(() => this.commentState$),
      map((state) => state.editable),
      share()
    );

    this.canReply$ = this.user.hasPermission('reply[TODO]');

    this.reply$ = this.canReply$.pipe(
      filter(Boolean),
      switchMap(() => this.form.onOpenCreate(this.id)),
      share()
    );

    this.edit$ = this.editable$.pipe(
      filter(Boolean),
      switchMap(() => this.form.onOpenEdit(this.id)),
      withLatestFrom(this.comment$, (open, comment) => {
        this.commentBody = comment.body.value;
        return open;
      })
    );

  }

  Edit() {
    this.form.openEdit(this.comment_id);
  }

  Reply() {
    // this.Expand();
    this.form.openCreate(this.comment_id);
  }

  Expand() {
    this.state.nodeExpand(this.comment_id);
  }

  Collapse() {
    this.state.nodeCollapse(this.comment_id);
  }
}

