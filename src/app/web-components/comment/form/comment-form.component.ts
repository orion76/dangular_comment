import {ChangeDetectionStrategy, Component, Inject, Input, OnInit} from '@angular/core';
import {EDITOR_SERVICE, EditorService} from '@dangular-components/editor';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, ICommentFormService, ICommentService} from '../../services/types';
import {EntityComment, IEntityComment} from '../../configs/entities/comment/comment--comment';
import {Observable, of} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IFormattedBody} from '../types';
import {map, switchMap, take, tap} from 'rxjs/operators';

export type TCommentFormMode = 'edit' | 'reply';

@Component({
  selector: 'comment-form',
  template: `

      <div [formGroup]="form" class="comment-form__editor">
          <ng-content select="[formHeader]"></ng-content>
          <editor class="editor comment-form__text" formControlName="value"></editor>
          <ng-content select="[formFooter]"></ng-content>
      </div>
      <div class="comment-form__actions comment-form-actions">
          <input type="submit" (click)="Submit()" [disabled]="disabled" [hidden]="false" value="{{'save'|translate}}" class="comment-form-actions__button">
          <input type="submit" (click)="Cancel()" [disabled]="disabled" [hidden]="false" value="{{'cancel'|translate}}" class="comment-form-actions__button">
      </div>


  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: EDITOR_SERVICE, useClass: EditorService}]
})
export class CommentFormComponent implements OnInit {

  public config = {
    toolbar: {
      buttons: ['bold', 'italic', 'quote'],
      static: true,
      align: 'left',
    }
  };

  @Input() placeholder = '..Enter text here';

  @Input() disabled: boolean;

  @Input() comment_id: string = null;
  @Input() parent_id: string = null;
  @Input() mode: TCommentFormMode;
  content: string = null;

  comment$: Observable<IEntityComment>;

  form: FormGroup;

  constructor(
    @Inject(COMMENT_SERVICE) private commentService: ICommentService,
    @Inject(COMMENT_FORM_SERVICE) private formService: ICommentFormService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    console.log('[form]', 'init');
    const body: IFormattedBody = {value: '', format: 'basic_html'};
    this.form = this.fb.group(body);


    switch (this.mode) {
      case 'edit' :
        this.comment$ = this.commentService.loadComment(this.comment_id).pipe(
          tap((comment) => this.form.patchValue(comment.body)))
        ;
        break;
      case 'reply' :
        this.comment$ = of(new EntityComment());
        break;
    }
  }

  Submit() {
    this.saveComment()
      .pipe(take(1))
      .toPromise().then(() =>
      this.formService.closeForms()
    );
  }

  Cancel() {
    this.formService.closeForms();
  }

  saveComment(): Observable<IEntityComment> {
    return this.comment$.pipe(
      map((comment) => {
        comment.body = this.form.value;
        return comment;
      }),
      switchMap((comment: IEntityComment) => {
        let action$: Observable<IEntityComment>;
        switch (this.mode) {
          case 'reply':
            action$ = this.commentService.saveNew(comment, this.parent_id);
            break;
          case 'edit':
            action$ = this.commentService.saveUpdate(comment);
            break;
        }
        return action$;
      }));
  }

}



