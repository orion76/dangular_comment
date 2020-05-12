import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE} from '../services/types';
import {CommentFormService} from '../services/comment-form.service';

import {CommentService} from '../services/comment.service';
import {EntitiesConfigModule} from '../configs/entities/module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommentStateService} from '../services/comment-state.service';
import {CommentComponent} from './comment.component';
import {CommentAuthorComponent} from './common/comment-author.component';
import {CommentFormComponent} from './form/comment-form.component';

import {CommentListComponent} from './list/comment-list.component';
import {HttpClientModule} from '@angular/common/http';
import {DataModule} from '@dangular-data/data.module';
import {UserModule} from '../services/user/user.module';
import {TranslateModule} from '@dangular-common/translate/translate.pipe';
import {TimerModule} from '@dangular-components/timer/timer.component';
import {VoteUpDownModule} from '@dangular-components/vote/vote.module';
import {TextSelectionModule} from '@dangular-components/text-selection/module';


import {MediumEditorModule} from 'angular2-medium-editor';
import {EditorModule} from '@dangular-components/editor/editor.component';
import {AccessService} from '@dangular-data/access/access.service';

import {CommentViewModule} from './view/comment-view.module';
import {CommentActionsModule} from './comment-actions.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DataModule.forRoot(),
    DataModule.forInterceptor(AccessService),
    UserModule,
    EntitiesConfigModule,
    FormsModule,
    TranslateModule,
    VoteUpDownModule,
    TextSelectionModule,
    MediumEditorModule,
    EditorModule,
    CommentActionsModule,
    CommentViewModule,
    ReactiveFormsModule
  ],
  exports: [
    CommentComponent,
    CommentAuthorComponent,
    CommentFormComponent,
    CommentListComponent,
  ],
  declarations: [
    CommentComponent,
    CommentAuthorComponent,
    CommentFormComponent,
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
