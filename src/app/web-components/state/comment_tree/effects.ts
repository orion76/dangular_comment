import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {COMMENT_SERVICE, COMMENT_FORM_SERVICE, ICommentService, ICommentFormService} from '../../services/types';
import {select, Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {EntitiesAction} from '../entities/actions';
import {map, switchMap, tap} from 'rxjs/operators';
import {ICommentNode} from './reducer';
import {CommentTreeAction} from './actions';
import {IEntityComment} from '../../comment/types';
import {EntitiesSelect} from '../entities/selector';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {of} from 'rxjs';


function addChild(nodes: Record<string, ICommentNode>, comment: IEntityComment) {
  const {id, parentId} = comment;
  if (!nodes[parentId]) {
    nodes[parentId] = {id: parentId, children: new Set()};
  }
  nodes[parentId].children.add(id);
  return nodes;
}

function getNodes(comments: IEntityComment[]): Record<string, ICommentNode> {
  return comments.reduce((acc: Record<string, ICommentNode>, comment) => addChild(acc, comment), {});
}

function addParents(store: Store<AppState>, nodes: Record<string, ICommentNode>) {
  const ids = Object.keys(nodes);
  if (ids.length > 0) {
    return store.pipe(
      select(EntitiesSelect.CommentsByIds, {ids}),
      switchMap((parents: IEntityComment[]) => {
        parents
          .filter((parent) => Boolean(parent.parentId))
          .forEach((parent) => {
            nodes[parent.id].parent = parent.parentId;
          });
        return fromArray(Object.values(nodes));
      })
    );
  } else {
    return of(null);
  }
}

function createNode(id: string, parent?: string): ICommentNode {
  return {
    id,
    parent,
    children: new Set()
  };
}

@Injectable()
export class CommentTreeEffects {
  effectAddEntity$ = createEffect(() => this.actions$.pipe(
    ofType(EntitiesAction.EActions.ADD_ENTITY),
    map((action: EntitiesAction.AddEntity) => createNode(action.entity.id)),
    map((node: ICommentNode) => new CommentTreeAction.AddNode(node)),
    ),
  );

  effectAddNode$ = createEffect(() => this.actions$.pipe(
    ofType(CommentTreeAction.EActions.ADD_NODE),
    tap(()=> console.log('1111111')),
    map((action: CommentTreeAction.AddNode) => action.node),
    switchMap((node: ICommentNode) => this.service.loadChildren(node.id)),
    tap(()=> console.log('222222')),
    map((comments: IEntityComment[]) => new EntitiesAction.AddComments(comments))
    ),
  );


  // effectAddComments$ = createEffect(() => this.actions$.pipe(
  //   ofType(EntitiesAction.EActions.ADD_COMMENTS),
  //   map((action: EntitiesAction.AddComments) => getNodes(action.comments)),
  //   switchMap((nodes: Record<string, ICommentNode>) => addParents(this.store, nodes)),
  //   map((node: ICommentNode) => {
  //     if (node) {
  //       return new CommentTreeAction.AddNode(node);
  //     }
  //   })
  //   ),
  // );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
  ) {
  }
}
