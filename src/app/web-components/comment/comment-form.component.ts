import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {COMMENT_SERVICE, ICommentService} from '../services/types';
import {IAppState} from '../state/IAppState';
import {Store} from '@ngrx/store';
import {UFormMode} from './types';


export interface IButton {
  name: string,
  callback: any,
  hidden?: boolean,
  disabled?: boolean
}

@Component({
  selector: 'comment-form',
  template: `
    <quill-editor theme="snow"
                  [(ngModel)]="content"
                  [modules]="modules"
                  (onFocus)="onFocus($event)"
                  (onBlur)="onBlur($event)"

    ></quill-editor>
    <div class="comment-form-action">
      <input type="submit" (click)="Save()" [disabled]="false" [hidden]="false" value="Save">
      <input type="submit" (click)="actionCancel()" [disabled]="false" [hidden]="false" value="Cancel">
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent implements OnInit {
  @Input() mode: UFormMode = 'create';
  @Input() commentId: string;
  @Input() parentId: string;
  @Input() content: string;

  modules = {
    toolbar: [['bold', 'italic'], ['link', 'image']]
  };

  constructor(@Inject(COMMENT_SERVICE) private service: ICommentService,
              private store: Store<IAppState>,
              private cdr: ChangeDetectorRef
  ) {
  }


  onFocus(event) {
  }

  onBlur(event) {
  }

  Save() {
    switch (this.mode) {
      case 'create':
        this.service.saveNew(this.parentId, this.content);
        break;

      case 'edit':
        this.service.saveUpdate(this.commentId, this.content);
        break;
    }
  }

  actionCancel() {
    this.content = '';
  }

  ngOnInit() {
    this.content = '';
    this.cdr.detectChanges();
  }

}



