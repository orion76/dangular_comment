import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {COMMENT_SERVICE, ICommentService} from '../../services/types';
import {IEntityComment} from '../../configs/entities/comment/comment--comment';
import {IEntityUser, IUserService, USER_SERVICE} from '../../services/user/types';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'comment-list',
  template: `
    <comment-form *ngIf="reply$|async" class="comment-form comment-form-reply">
      <comment-author *ngIf="loggedUser$|async as loggedUser" formHeader
                      [user]="loggedUser"
                      class="comment-author comment-editor__author"></comment-author>
    </comment-form>
    <comment *ngFor="let comment_id of items_ids$|async" [comment_id]="comment_id" class="comment"></comment>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit {
  @Input() parent_id: string;

  items_ids$: Observable<string[]>;
  canReply$: Observable<boolean>;
  reply$: Observable<boolean>;
  loggedUser$: Observable<IEntityUser>;

  constructor(@Inject(COMMENT_SERVICE) private commentService: ICommentService,
              @Inject(USER_SERVICE) private user: IUserService,
              private cdr: ChangeDetectorRef) {
  }


  trackByCommentId(index: number, commentId: string): string {
    return commentId;
  }

  ngOnInit() {
    this.items_ids$ = this.commentService.getChildrenIds(this.parent_id).pipe(
      distinctUntilChanged((comments1: IEntityComment[], comments2: IEntityComment[]) => {
        if (comments1.length !== comments2.length) {
          return false;
        }

        return comments1.every((comment, index) => comments2[index] && comment.id === comments2[index].id);
      })
    );
    this.loggedUser$ = this.user.currentUser();
    this.canReply$ = this.user.hasPermission('reply[TODO]');
    this.cdr.detectChanges();
  }


}
