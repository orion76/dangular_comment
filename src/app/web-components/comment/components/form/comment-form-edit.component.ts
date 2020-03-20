import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityUser, IUserService, USER_SERVICE} from '../../../services/user/types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../../../services/types';
import {IEntityComment} from '../../types';


@Component({
  selector: 'comment-form-edit',
  template: `

      <comment-editor [(content)]="commentContent" class="comment-editor">

        <div class="comment-form__actions comment-form-actions" comment-actions>
          <input type="submit" (click)="Save()" [hidden]="false" value="Save" class="comment-form-actions__button">
          <input type="submit" (click)="Cancel()" [hidden]="false" value="Cancel" class="comment-form-actions__button">
        </div>

      </comment-editor>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormEditComponent implements OnInit {
  @Input() comment: IEntityComment;
  openForm$: Observable<boolean>;
  loggedUser$: Observable<IEntityUser>;
  commentContent: string;

  constructor(@Inject(COMMENT_SERVICE) private service: ICommentService,
              @Inject(USER_SERVICE) private user: IUserService,
              @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loggedUser$ = this.user.loggedUser();
    this.openForm$ = this.form.onOpenCreate(this.comment.id);
    this.commentContent = this.comment.body.value;
    this.cdr.detectChanges();
  }

  Save() {
    this.service.saveUpdate(this.comment.id, this.commentContent)
      .toPromise().then(() => {
      this.form.openRootForm();
    });

  }

  Cancel() {
    this.form.openRootForm();
  }

}

