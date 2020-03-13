import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentAuthorComponent} from './components/comment-author.component';
import {CommentStateComponent} from './components/comment-state.component';
import {CommentContentComponent} from './components/comment-content.component';
import {CommentListComponent} from './comment-list.component';
import {CommentComponent} from './comment.component';
import {CommentEditorComponent} from './comment-editor.component';
import {COMMENT_SERVICE, COMMENT_FORM_SERVICE} from '../services/types';
import {CommentFormService} from '../services/comment-form.service';
import {QuillModule} from 'ngx-quill';
import {CommentService} from '../services/comment.service';
import {CommentActionsComponent} from './components/comment-actions.component';
import {EntitiesConfigModule} from '../configs/entities/module';
import {FormsModule} from '@angular/forms';
import {CommentViewComponent} from './comment-view.component';

@NgModule({
  imports: [
    CommonModule,
    EntitiesConfigModule,
    QuillModule, FormsModule,
    QuillModule.forRoot(),
  ],
  exports: [CommentListComponent],
  declarations: [
    CommentComponent,
    CommentAuthorComponent,
    CommentStateComponent,
    CommentContentComponent,
    CommentActionsComponent,
    CommentEditorComponent,
    CommentViewComponent,
    CommentListComponent,
  ],
  providers: [
    {provide: COMMENT_SERVICE, useClass: CommentService},
    {provide: COMMENT_FORM_SERVICE, useClass: CommentFormService},
  ],
})
export class CommentModule {
}
