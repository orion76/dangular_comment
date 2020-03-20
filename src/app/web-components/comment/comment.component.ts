import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentService, ICommentStateService} from '../services/types';
import {Observable} from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';
import {ICommentNode} from '../state/comment_tree/reducer';


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
                <button (click)="Edit()" class="comment-actions__button">edit</button>
                <button (click)="Reply()" class="comment-actions__button">reply</button>
                <ng-container *ngIf="comment.child_count">
                  <button *ngIf="(state$|async)?.children; else collapsed"
                          (click)="Collapse()" class="comment-actions__button">collapse({{comment.child_count}})
                  </button>
                  <ng-template #collapsed>
                    <button
                      (click)="Expand()" class="comment-actions__button">expand({{comment.child_count}})
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
export class CommentComponent implements OnInit {
  edit$: Observable<boolean>;
  reply$: Observable<boolean>;
  state$: Observable<ICommentNode>;
  comment$: Observable<IEntityComment>;
  // comment: IEntityComment;
  // commentSub: Subscription;
  id: string;
  @Input() comment_id: string;

  @Input() entity_type: string;
  @Input() entity_id: string;
  @Input() field_name: string;
  commentBody: string;


  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
    private cdr: ChangeDetectorRef
  ) {
  }

  debug(vars: any) {
    console.log('[debug] component', vars);
  }

  ngOnInit() {


    this.initComment();


    this.state$ = this.state.commentState(this.id);
  }


  initComment() {
    this.id = this.comment_id;
    this.comment$ = this.state.getComment(this.comment_id);
    this.reply$ = this.form.onOpenCreate(this.id);

    this.edit$ = this.form.onOpenEdit(this.id).pipe(
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

