import {NgModule} from '@angular/core';
import {ActionReducer, MetaReducer, StoreModule} from '@ngrx/store';

import {EffectsModule} from '@ngrx/effects';


import {IEntityStateVote, reducerVote} from '@dangular-components/vote/state/reducer';
import {ConfigRequestEffects, IStateConfigRequest, reducerConfigRequest} from './web-components/state/configs/request';
import {ConfigEntityEffects, IStateConfigEntity, reducerConfigEntity} from './web-components/state/configs/entity';
import {CommentsStateEffects, IStateCommentState, reducerCommentState} from './web-components/state/comment_state';

import {IStateCommentTree, reducerCommentTree} from './web-components/state/comment_tree';
import {IStateCommentGlobal, reducerCommentGlobal} from './web-components/state/comment_global';
import {EntitiesEffects, IStateEntities, reducerEntities} from '@dangular-data/store/entities';
import {EntitiesOperationEffects, IStateEntitiesOperations, reducerEntitiesOperations} from '@dangular-data/store/operations';
import {CommentTreeEffects} from './web-components/state/comment_tree/effects';


export interface AppStateModule {
  commentGlobalState: IStateCommentGlobal;
  entities: IStateEntities;
  entities_operations: IStateEntitiesOperations
  commentTree: IStateCommentTree;
  commentState: IStateCommentState;
  configRequest: IStateConfigRequest;
  configEntity: IStateConfigEntity;
  voteState: IEntityStateVote;
}

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    state = reducer(state, action);
    let prefix = ['[action]'];
    if (action.type.startsWith('[ENTITIES]')||action.type.startsWith('[OPERATIONS]')) {
      prefix = ['%c[action]', 'background: #f00 ;color: #fada55'];
    }

    console.log(...prefix, action.type, {action, state});
    return state;
  };
}

export const metaReducers: MetaReducer<any>[] = [
  debug,
];

@NgModule({
  imports: [
    StoreModule.forRoot({
        commentGlobalState: reducerCommentGlobal,
        entities: reducerEntities,
        entities_operations: reducerEntitiesOperations,
        commentTree: reducerCommentTree,
        commentState: reducerCommentState,
        configRequest: reducerConfigRequest,
        configEntity: reducerConfigEntity,
        voteState: reducerVote
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
      EntitiesOperationEffects,
      EntitiesEffects,
      CommentTreeEffects,
      ConfigRequestEffects,
      ConfigEntityEffects,
      CommentsStateEffects
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
