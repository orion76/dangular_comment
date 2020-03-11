
import {NgModule} from '@angular/core';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';


import {EntitiesEffects} from './entities/effects';
import {CommentTreeEffects} from './comment_tree/effects';
import {EffectsModule} from '@ngrx/effects';
import {IState as IEntitiesState, reducer as commentTreeReducer} from './comment_tree/reducer';
import {IState as ICommentTreeState, reducer as entitiesReducer} from './entities/reducer';

import {IState as IConfigRequestState, reducer as configRequestReducer} from './configs/request/reducer';
import {IState as IConfigEntityState, reducer as configEntityReducer} from './configs/entity/reducer';
import {IState as ILoggedUsersState, reducer as usersReducer} from './logged_user/reducer';
import {ConfigRequestEffects} from './configs/request/effects';
import {ConfigEntityEffects} from './configs/entity/effects';
import {LoggedUsersEffects} from './logged_user/effects';


export interface IAppState {
  entities: IEntitiesState;
  commentTree: ICommentTreeState;
  configRequest: IConfigRequestState;
  configEntity: IConfigEntityState;
  loggedUser: ILoggedUsersState;
}

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    try{
      state = reducer(state, action);
    }catch (e) {
      console.error('[action]', action.type, {action, state},e);
    }

    console.log('[action]', action.type, {action, state});
    return state;
  };
}

export const metaReducers: MetaReducer<any>[] = [debug];

@NgModule({
  imports: [
    StoreModule.forRoot({
        entities: entitiesReducer,
        commentTree: commentTreeReducer,
        configRequest: configRequestReducer,
        configEntity: configEntityReducer,
        loggedUser: usersReducer
      },
      {
        metaReducers,
        runtimeChecks: {
          // strictStateImmutability: true,
          // strictActionImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([
      EntitiesEffects,
      CommentTreeEffects,
      ConfigRequestEffects,
      ConfigEntityEffects,
      LoggedUsersEffects,
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
