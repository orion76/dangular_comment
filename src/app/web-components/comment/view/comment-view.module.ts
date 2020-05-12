import {NgModule} from '@angular/core';
import {CommentViewComponent} from './comment-view.component';
import {CommentActionComponent, CommentActionsComponent} from '../comment-actions.component';
import {CommentContentComponent} from './comment-content.component';
import {CommentStateComponent} from './comment-state.component';
import {TimerModule} from '@dangular-components/timer/timer.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@dangular-common/translate/translate.pipe';
import {VoteUpDownModule} from '@dangular-components/vote/vote.module';

@NgModule({
  imports: [
    CommonModule,
    TimerModule,
    TranslateModule,
    VoteUpDownModule,
  ],
  exports: [CommentViewComponent],
  declarations: [
    CommentViewComponent,
    CommentContentComponent,
    CommentStateComponent,
  ],
  providers: [],
})
export class CommentViewModule {
}
