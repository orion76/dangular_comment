import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {COMMENT_SERVICE, ICommentService} from '../services/types';
import {AppState} from '../state/app.state';
import {Store} from '@ngrx/store';


export interface IButton {
  name: string,
  callback: any,
  hidden?: boolean,
  disabled?: boolean
}

@Component({
  selector: 'comment-editor',
  template: `
    <quill-editor theme="snow"
                  [(ngModel)]="content"
                  [modules]="modules"
                  (onFocus)="onFocus($event)"
                  (onBlur)="onBlur($event)"
                  [disabled]="isDisabled"

                  class="comment-form__editor"
    ></quill-editor>
    <div class="comment-form__actions comment-form-actions">
      <input type="submit" (click)="Save()" [disabled]="isDisabled" [hidden]="false" value="Save" class="comment-form-actions__button">
      <input type="submit" (click)="Cancel()" [disabled]="isDisabled" [hidden]="false" value="Cancel" class="comment-form-actions__button">
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentEditorComponent implements OnInit {
  @Input() content: string;
  @Output() onSave = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<string>();
  @Input() isDisabled: boolean;
  modules = {
    toolbar: [['bold', 'italic'], ['link', 'image']]
  };

  constructor(@Inject(COMMENT_SERVICE) private service: ICommentService,
              private store: Store<AppState>,
              private cdr: ChangeDetectorRef
  ) {
  }


  onFocus(event) {
  }

  onBlur(event) {
  }

  Save() {
    this.onSave.emit(this.content);

  }

  Cancel() {
    this.onCancel.emit(this.content);
  }

  ngOnInit() {

  }

}



