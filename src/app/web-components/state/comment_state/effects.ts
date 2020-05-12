import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';

import {Store} from '@ngrx/store';

import {filter, map, switchMap} from 'rxjs/operators';

import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {AppStateModule} from '../../../app-state.module';
import {COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentService, ICommentStateService} from '../../services/types';
import {CommentTreeAction, ICommentNode} from '../comment_tree';
import {CommentGlobalAction} from '../comment_global';
import {CommentStateAction} from './actions';
import {IUserService, USER_SERVICE} from '../../services/user/types';
import {OperationAction} from '@dangular-data/store/operations';
import {createEntityOfJsonapiMany, createEntityOfJsonapiOne} from '@dangular-common/rxjs/operators';
import {EntityComment, IEntityComment} from '../../configs/entities/comment/comment--comment';
import {getEntities, getEntity} from '@dangular-data/store/utils';
import {ETypes} from '../../configs/entities/types';


@Injectable()
export class CommentsStateEffects {

  SaveNewSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.SAVE_NEW_SUCCESS),
    filter((action: OperationAction.SaveNewSuccess) => action.entity_type === ETypes.COMMENT),
    map((action: OperationAction.SaveNewSuccess) => getEntity(action.response)),
    createEntityOfJsonapiOne(EntityComment),
    map((comment: IEntityComment) => {
      const state = this.state.createCommentState(comment);
      return new CommentStateAction.StateInitMany([state]);
    }),
  ));

  LoadOneSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_ONE_SUCCESS),
    filter((action: OperationAction.LoadOneSuccess) => action.entity_type === ETypes.COMMENT),
    map((action: OperationAction.LoadOneSuccess) => getEntity(action.response)),
    createEntityOfJsonapiOne(EntityComment),
    map((comment: IEntityComment) => {
      const state = this.state.createCommentState(comment);
      return new CommentStateAction.StateInitMany([state]);
    }),
  ));


  LoadManySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_MANY_SUCCESS),
    filter((action: OperationAction.LoadManySuccess) => action.entity_type === ETypes.COMMENT),
    map((action: OperationAction.LoadManySuccess) => getEntities(action.response)),
    createEntityOfJsonapiMany(EntityComment),
    map((comments: IEntityComment[]) => {
      const states = comments.map((comment) => this.state.createCommentState(comment));
      return new CommentStateAction.StateInitMany(states);
    }),
  ));


  StateInitMany$ = createEffect(() => this.actions$.pipe(
    ofType(CommentStateAction.EActions.STATE_INIT_MANY),
    switchMap((action: CommentStateAction.StateInitMany) => {
      const {comments} = action;
      const ids = comments.map((comment) => comment.id);
      return this.userService.hasPermission('[TODO]reply').pipe(
        filter(Boolean),
        map(() => new CommentStateAction.SetCanReply(ids))
      );
    }),
  ));


  SetCommentedEntity$ = createEffect(() => this.actions$.pipe(
    ofType(CommentGlobalAction.EActions.SET_COMMENTED_ENTITY),
    map((action: CommentGlobalAction.SetCommentedEntity) => {
      const {entity} = action;
      const node: ICommentNode = {id: entity.id, isRoot: true, children: new Set(), expanded: true};
      return new CommentTreeAction.AddNode(node);
    }),
  ));

  // CommentLoaded$ = createEffect(() => this.actions$.pipe(
  //   ofType(DataAction.EActions.),
  //   filter((action: DataAction.AddOne) => action.entity.type === ETypes.COMMENT),
  //   switchMap((action: DataAction.AddOne) => {
  //     const parentId = getParentId(action.entity);
  //     return this.store.pipe(
  //       select(CommentTreeSelect.Node, {id: parentId}),
  //       filter((parent: ICommentNode) => parent.expanded),
  //       map(() => new CommentTreeAction.AddChildren(parentId, [action.entity.id])),
  //       first()
  //     );
  //   })
  //
  // ));


  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(USER_SERVICE) private userService: IUserService,
    @Inject(COMMENT_SERVICE) private commentService: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
  ) {

  }
}
