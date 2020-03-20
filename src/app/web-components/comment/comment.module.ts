import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE} from '../services/types';
import {CommentFormService} from '../services/comment-form.service';
import {QuillModule} from 'ngx-quill';
import {CommentService} from '../services/comment.service';
import {EntitiesConfigModule} from '../configs/entities/module';
import {FormsModule} from '@angular/forms';
import {CommentStateService} from '../services/comment-state.service';
import {CommentComponent} from './comment.component';
import {CommentAuthorComponent} from './components/comment-author.component';
import {CommentStateComponent} from './components/comment-state.component';
import {CommentContentComponent} from './components/comment-content.component';
import {CommentFormEditComponent} from './components/form/comment-form-edit.component';
import {CommentFormReplyComponent} from './components/form/comment-form-reply.component';
import {CommentActionsComponent} from './components/comment-actions.component';
import {CommentEditorComponent} from './comment-editor.component';
import {CommentViewComponent} from './comment-view.component';
import {CommentListComponent} from './comment-list.component';
import {AppStateModule} from '../state/state.module';
import {HttpClientModule} from '@angular/common/http';
import {DataModule} from '@dangular-data/data.module';
import {UserModule} from '../services/user/user.module';

@NgModule({
  imports: [
    CommonModule,
    AppStateModule,
    HttpClientModule,
    DataModule.forRoot(),
    UserModule,
    EntitiesConfigModule,
    QuillModule,
    QuillModule.forRoot(),
    FormsModule,
  ],
  exports: [
    CommentComponent,
    CommentAuthorComponent,
    CommentStateComponent,
    CommentContentComponent,
    CommentActionsComponent,
    CommentFormReplyComponent,
    CommentFormEditComponent,
    CommentEditorComponent,
    CommentViewComponent,
    CommentListComponent,
  ],
  declarations: [
    CommentComponent,
    CommentAuthorComponent,
    CommentStateComponent,
    CommentContentComponent,
    CommentActionsComponent,
    CommentFormReplyComponent,
    CommentFormEditComponent,
    CommentEditorComponent,
    CommentViewComponent,
    CommentListComponent,
  ],
  providers: [
    {provide: COMMENT_SERVICE, useClass: CommentService},
    {provide: COMMENT_STATE_SERVICE, useClass: CommentStateService},
    {provide: COMMENT_FORM_SERVICE, useClass: CommentFormService},
  ],
})
export class CommentModule {

}
