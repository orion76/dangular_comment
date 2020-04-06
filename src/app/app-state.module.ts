import {NgModule} from '@angular/core';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';

import {EffectsModule} from '@ngrx/effects';
import {IStateCommentTree, reducer as commentTreeReducer} from './web-components/state/comment_tree/reducer';
import {IStateCommentState, reducer as commentStateReducer} from './web-components/state/comment_state/reducer';
import {IStateComments, reducer as commentsReducer} from './web-components/state/comments/reducer';

import {IState as IConfigRequestState, reducer as configRequestReducer} from './web-components/state/configs/request/reducer';
import {IState as IConfigEntityState, reducer as configEntityReducer} from './web-components/state/configs/entity/reducer';
import {IEntityStateVote, reducer as voteReducer} from '@dangular-components/vote/state/reducer';
import {IStateCommentCommon, reducer as commentCommonReducer} from './web-components/state/comment_common/reducer';
import {ConfigRequestEffects} from './web-components/state/configs/request/effects';
import {ConfigEntityEffects} from './web-components/state/configs/entity/effects';
import {CommentsEffects} from './web-components/state/comments.effects';


export interface AppStateModule {
  comments: IStateComments;
  commentTree: IStateCommentTree;
  commentState: IStateCommentState;
  configRequest: IConfigRequestState;
  configEntity: IConfigEntityState;
  commentCommon: IStateCommentCommon;
  voteState: IEntityStateVote;
}

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    // try{
    //   state = reducer(state, action);
    // }catch (e) {
    //   console.error('[action]', action.type, {action, state},e);
    // }
    state = reducer(state, action);
    console.log('[action]', action.type, {action, state});
    return state;
  };
}

export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  imports: [

    StoreModule.forRoot({
        comments: commentsReducer,
        commentTree: commentTreeReducer,
        commentState: commentStateReducer,
        configRequest: configRequestReducer,
        configEntity: configEntityReducer,
        commentCommon: commentCommonReducer,
        voteState: voteReducer
      },
      {
        // metaReducers,
        runtimeChecks: {
          // strictStateImmutability: true,
          // strictActionImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([
      CommentsEffects,
      ConfigRequestEffects,
      ConfigEntityEffects,
    ]),
    // StoreDevtoolsModule.instrument({
    //   maxAge: 15,
    //
    //   logOnly: environment.production,
    // }),
  ],
  exports: [],
  providers: [],
})
export class AppStateModule {
}
