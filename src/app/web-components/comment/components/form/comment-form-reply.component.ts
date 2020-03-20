import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityUser, IUserService, USER_SERVICE} from '../../../services/user/types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../../../services/types';
import {IEntityComment} from '../../types';


@Component({
  selector: 'comment-form-reply',
  template: `


    <comment-editor [(content)]="commentContent"
                    [author]="loggedUser$|async"
                    [disabled]="disabled"

                    class="comment-editor">

      <div class="comment-form__actions comment-form-actions" comment-actions>
        <input type="submit" (click)="Save()" [disabled]="disabled" [hidden]="false" value="Save" class="comment-form-actions__button">
        <input type="submit" (click)="Cancel()" [disabled]="disabled" [hidden]="false" value="Cancel" class="comment-form-actions__button">
      </div>

    </comment-editor>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormReplyComponent implements OnInit {
  @Input() parent: IEntityComment;
  @Input() disabled: boolean;

  @Input() entity_id: string;
  loggedUser$: Observable<IEntityUser>;
  commentContent: string;

  constructor(@Inject(COMMENT_SERVICE) private service: ICommentService,
              @Inject(USER_SERVICE) private user: IUserService,
              @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loggedUser$ = this.user.loggedUser();
  }

  Save() {
    this.service.saveNew({value: this.commentContent, format: 'basic_html'}, this.parent)
      .subscribe(() => {
        this.commentContent = '';
        this.cdr.detectChanges();
        this.hideForm();
      });

  }

  Cancel() {
    this.commentContent = '';
    this.hideForm();
  }

  hideForm() {
    this.form.openRootForm();

  }
}

