import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';

import {Action, select, Store} from '@ngrx/store';

import {filter, map, switchMap, take} from 'rxjs/operators';

import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {Observable} from 'rxjs';
import {AppStateModule} from '../../../app-state.module';
import {CommentTreeAction} from './actions';
import {CommentTreeSelect} from './selector';
import {ICommentNode} from './types';
import {COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentService, ICommentStateService} from '../../services/types';
import {CommentStateAction} from '../comment_state';
import {log} from '@dangular-common/rxjs/operators';


function getChildrenIds(store: Store<AppStateModule>) {
  return (action: CommentTreeAction.ChildrenCollapse) => {
    const {id} = action.node;
    return store.pipe(
      select(CommentTreeSelect.TreeIds, {id}),
      take(1),
      filter((ids: string[]) => ids.length > 0)
    );
  };
}


@Injectable()
export class CommentTreeEffects {
  AddNode__AddComments$ = createEffect(() => this.actions$.pipe(
    ofType(CommentTreeAction.EActions.ADD_NODE),
    map((action: CommentTreeAction.AddNode) => action.node),
    filter((node) => node.expanded),
    switchMap((node: ICommentNode) => this.createActionAddChildren(node)),
  ));
  Expand__AddComments$ = createEffect(() => this.actions$.pipe(
    ofType(CommentTreeAction.EActions.CHILDREN_EXPAND),
    map((action: CommentTreeAction.ChildrenExpand) => action.node),
    switchMap((node: ICommentNode) => this.createActionAddChildren(node)),
  ));
  Collapse__DeleteNode$ = createEffect(() => this.actions$.pipe(
    ofType(CommentTreeAction.EActions.CHILDREN_COLLAPSE),
    switchMap(getChildrenIds(this.store)),
    switchMap((ids: string[]) => [
      new CommentTreeAction.DeleteNodes(ids),
      new CommentStateAction.SetExpanded(ids, false),
    ])
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(COMMENT_SERVICE) private commentService: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
  ) {
  }

  createActionAddChildren(node: ICommentNode): Observable<Action> {
    return this.commentService.loadNodeComments(node).pipe(
      take(1),
      switchMap((comments) => {
        const ids = comments.map((comment) => comment.id);
        return [
          new CommentTreeAction.ChildrenAdd(node.id, ids),
          new CommentStateAction.SetExpanded([node.id], true),
        ];
      })
    );
  }
}

