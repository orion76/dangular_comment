import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {IEntityUser} from '../services/user/types';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {COMMENT_FORM_SERVICE, ICommentFormService} from '../services/types';



@Component({
  selector: 'comment-editor',
  template: `
    <comment-author *ngIf="author" [user]="author" class="comment-author comment-editor__author"></comment-author>

    <div class="comment-form comment-editor__form">
      <ace
        [(value)]="content"
        [disabled]="disabled"
        (valueChange)="onContentChanged($event)"
        (click)="onClick($event)"
        class="comment-editor__editor"
      ></ace>
      <div class="comment-editor__actions comment-form-actions">
        <ng-content select="[comment-actions]"></ng-content>
      </div>
    </div>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  public editorId = 'commentEditor';

  public config = {toolbar: ['bold', 'italic', 'blockquote']};
  @Input() content: string = '';
  @Input() author: IEntityUser;

  @Input() insert: EventEmitter<string>;

  insertSubs: Subscription;

  @Output() contentChange = new EventEmitter();
  @Input() disabled: boolean;
  // @ViewChild(CKEditorComponent, {static: true}) editorComponent: CKEditorComponent;

  constructor(@Inject(Renderer2) private renderer: Renderer2,
              @Inject(NgZone) private zone: NgZone,
              @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
// this.editor.commands
    this.insertSubs = this.form.onInsertOpen()
      .pipe(filter(Boolean))
      .subscribe((text) => {
        // this.editorComponent.insertTextAfterCursor(text);
      });

  }

  ngOnDestroy(): void {
    this.insertSubs.unsubscribe();
  }

  ngAfterViewInit() {

  }

  onContentChanged(event) {
    this.contentChange.emit(this.content);
  }

  onFocus(event) {

  }

  onBlur(event) {
  }

  onClick(event) {

  }
}



