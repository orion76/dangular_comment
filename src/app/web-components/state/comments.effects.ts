import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentService, ICommentStateService} from '../services/types';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../app-state.module';
import {CommentsAction} from './comments/actions';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {CommentStateAction} from './comment_state/actions';
import {CommentTreeSelect} from './comment_tree/selector';
import {ICommentNode} from './comment_tree/reducer';
import {CommentTreeAction} from './comment_tree/actions';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {Observable, of} from 'rxjs';
import {ETypes} from '../configs/entities/types';
import {getParentId} from '../util';
import {IEntityComment} from '../configs/entities/comment/comment--comment';
import {VoteStateAction} from '@dangular-components/vote/state/actions';


function isNodeMissing(store: Store<AppStateModule>) {
  return (action: CommentStateAction.Expand) => store.pipe(
    select(CommentTreeSelect.Node, {id: action.id}),
    filter((node: ICommentNode) => !node),
    map(() => action),
    take(1));
}


function mergeSets(a: Set<string>, b: Set<string>) {
  const _a: Set<string> = new Set(a);
  return [...b].reduce((acc, item) => acc.add(item), _a);
}

function getOrCreateNode(store: Store<AppStateModule>) {
  return (action: CommentsAction.NodeAddComments) => store.pipe(
    select(CommentTreeSelect.Node, {id: action.nodeId}),
    take(1),
    map((node: ICommentNode) => {
      const _node = node ? {...node} : {id: action.nodeId, children: new Set<string>()};
      const ids = action.comments.map((comment) => comment.id);
      _node.children = mergeSets(_node.children, new Set(ids));
      return _node;
    })
  );
}

function loadComments(service: ICommentService) {
  return (action: CommentStateAction.Expand) => {
    const load$ = action.root ? service.loadRoot(action.id) : service.loadChildren(action.id);
    return load$.pipe(
      map((children) => ({children, id: action.id}))
    );
  };
}

function deleteTree(store: Store<AppStateModule>) {
  return (action: CommentStateAction.Collapse) => {
    return store.pipe(
      select(CommentTreeSelect.TreeIds, {id: action.id}),
      take(1),
      filter((ids: string[]) => ids.length > 0)
    );
  };
}

function isExistsParentComment(data: IDataService) {
  return (action: CommentsAction.CommentAdd): Observable<IEntityComment> => {
    const {comment} = action;
    const load$ = comment.pid ? data.one(ETypes.COMMENT, {id: comment.pid.id}) : of(null);
    return load$.pipe(take(1), filter(Boolean));
  };
}

function isExistsParentNode(value: boolean, store: Store<AppStateModule>) {
  return (action: CommentsAction.CommentAdd): Observable<IEntityComment> => {
    const {comment} = action;
    return store.pipe(
      select(CommentTreeSelect.Node, {id: getParentId(comment)}),
      take(1),
      filter((node) => !!node === value),
      map(() => comment)
    );
  };
}


@Injectable()
export class CommentsEffects {

  CommentAdd__ParentUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsAction.EActions.COMMENT_ADD),
    tap((comment) => console.log('CommentAdd__ParentUpdate', {comment})),
    switchMap(isExistsParentComment(this.data)),
    tap((comment) => console.log('CommentAdd__ParentUpdate:isExistsParentComment', {comment})),
    map((parent) => new CommentsAction.CommentUpdate(parent)),
  ));

  CommentAdd__TreeUpdate$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsAction.EActions.COMMENT_ADD),
    tap((comment) => console.log('CommentAdd__TreeUpdate', {comment})),
    switchMap(isExistsParentNode(true, this.store)),
    tap((comment) => console.log('CommentAdd__TreeUpdate:isExistsParentNode-TRUE', {comment})),
    map((comment) => new CommentTreeAction.AddChildren(getParentId(comment), [comment.id])),
  ));

  CommentAdd__Expand = createEffect(() => this.actions$.pipe(
    ofType(CommentsAction.EActions.COMMENT_ADD),
    tap((comment) => console.log('CommentAdd__TreeUpdate', {comment})),
    switchMap(isExistsParentNode(false, this.store)),
    tap((comment) => console.log('CommentAdd__TreeUpdate:isExistsParentNode-FALSE', {comment})),
    map((comment) => new CommentStateAction.Expand(getParentId(comment))),
  ));


  Expand__AddComments$ = createEffect(() => this.actions$.pipe(
    ofType(CommentStateAction.EActions.EXPAND),
    switchMap(isNodeMissing(this.store)),
    switchMap(loadComments(this.service)),
    switchMap(({id, children}) => {
      const ids = children.map((comment) => comment.id);
      return [
        new CommentsAction.NodeAddComments(id, children, {expanded: true}),
        new VoteStateAction.LoadResults(ids, 'comment--comment', 'updown')
      ];
    })
  ));

  Collapse__DeleteNode$ = createEffect(() => this.actions$.pipe(
    ofType(CommentStateAction.EActions.COLLAPSE),
    switchMap(deleteTree(this.store)),
    map((ids: string[]) => new CommentTreeAction.DeleteNodes(ids))
  ));
  AddEntity__Expand$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsAction.EActions.ADD_ENTITY),
    map((action: CommentsAction.AddEntity) => new CommentStateAction.Expand(action.entity.id, true)),
  ));

  AddComments__AddNodes$ = createEffect(() => this.actions$.pipe(
    ofType(CommentsAction.EActions.NODE_ADD_COMMENTS),
    filter((action: CommentsAction.NodeAddComments) => action.state && action.state.expanded),
    switchMap(getOrCreateNode(this.store)),
    map((node: ICommentNode) => new CommentTreeAction.AddNodes([node])),
  ));


  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
    @Inject(DATA_SERVICE) private data: IDataService,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
  ) {
  }
}
