import {NgModule} from '@angular/core';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';

import {EffectsModule} from '@ngrx/effects';
import {IStateCommentTree , reducer as commentTreeReducer} from './comment_tree/reducer';
import {IStateCommentState , reducer as commentStateReducer} from './comment_state/reducer';
import {IStateComments , reducer as commentsReducer} from './comments/reducer';

import {IState as IConfigRequestState, reducer as configRequestReducer} from './configs/request/reducer';
import {IState as IConfigEntityState, reducer as configEntityReducer} from './configs/entity/reducer';
import {IStateCommentCommon, reducer as commentCommonReducer} from './comment_common/reducer';
import {ConfigRequestEffects} from './configs/request/effects';
import {ConfigEntityEffects} from './configs/entity/effects';
import {CommentsEffects} from './comments.effects';


export interface StateModule {
  comments: IStateComments;
  commentTree: IStateCommentTree;
  commentState: IStateCommentState;
  configRequest: IConfigRequestState;
  configEntity: IConfigEntityState;
  commentCommon: IStateCommentCommon;
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
        commentCommon: commentCommonReducer
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
