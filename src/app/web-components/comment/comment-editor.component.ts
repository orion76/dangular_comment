import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IEntityUser} from '../services/user/types';
import {QuillEditorComponent} from 'ngx-quill';


@Component({
  selector: 'comment-editor',
  template: `
    <comment-author *ngIf="author" [user]="author" class="comment-author comment-editor__author"></comment-author>

    <div class="comment-form comment-editor__form">
      <quill-editor theme="snow"
                    [(ngModel)]="content"
                    [modules]="modules"
                    (onFocus)="onFocus($event)"
                    (onBlur)="onBlur($event)"
                    [disabled]="disabled"
                    (onContentChanged)="onContentChanged($event)"

                    class="comment-editor__editor"
      ></quill-editor>
      <div class="comment-editor__actions comment-form-actions">
        <ng-content select="[comment-actions]"></ng-content>
      </div>
    </div>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentEditorComponent implements OnInit {

  @Input() content: string;
  @Input() author: IEntityUser;

  @Output() contentChange = new EventEmitter();
  @Input() disabled: boolean;
  modules = {
    toolbar: [['bold', 'italic'], ['link', 'image']]
  };

  @ViewChild(QuillEditorComponent, {static: true}) editor: QuillEditorComponent;

  constructor(private cdr: ChangeDetectorRef) {
  }

  onContentChanged(event) {
    this.contentChange.emit(event.html);
  }

  onFocus(event) {
  }

  onBlur(event) {
  }


  ngOnInit() {
  }

}



