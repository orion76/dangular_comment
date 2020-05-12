import {Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';

import {Store} from '@ngrx/store';

import {map} from 'rxjs/operators';
import {AppStateModule} from '../../../app-state.module';
import {CommentGlobalAction} from './actions';
import {CommentTreeAction} from '../comment_tree/actions';
import {ICommentNode} from '../comment_tree/types';


@Injectable()
export class CommentGlobalEffects {

  SetCommentedEntity$ = createEffect(() => this.actions$.pipe(
    ofType(CommentGlobalAction.EActions.SET_COMMENTED_ENTITY),
    map((action: CommentGlobalAction.SetCommentedEntity) => {
      const {entity} = action;
      const node: ICommentNode = {id: entity.id, isRoot: true, children: new Set(), expanded: true};
      return new CommentTreeAction.AddNode(node);
    }),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
  ) {

  }
}
