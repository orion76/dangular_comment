import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentAuthorComponent} from './components/comment-author.component';
import {CommentStateComponent} from './components/comment-state.component';
import {CommentContentComponent} from './components/comment-content.component';
import {CommentListComponent} from './comment-list.component';
import {CommentComponent} from './comment.component';
import {CommentFormComponent} from './comment-form.component';
import {COMMENT_SERVICE, EDITOR_SERVICE} from '../services/types';
import {EditorService} from '../services/editor.service';
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
    CommentFormComponent,
    CommentViewComponent,
    CommentListComponent,
  ],
  providers: [
    {provide: COMMENT_SERVICE, useClass: CommentService},
    {provide: EDITOR_SERVICE, useClass: EditorService},
  ],
})
export class CommentModule {
}
