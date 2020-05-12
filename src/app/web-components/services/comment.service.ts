import {Inject, Injectable} from '@angular/core';
import {COMMENT_STATE_SERVICE, ICommentService, ICommentStateService} from './types';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {IFormattedBody} from '../comment/types';
import {Observable} from 'rxjs';
import {IEntityBase} from '@dangular-common/entity/types';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../app-state.module';
import {map, switchMap, tap} from 'rxjs/operators';
import {ETypes} from '../configs/entities/types';
import {IFilters} from '@dangular-data/request/request.service';
import {ICommentNode, CommentTreeSelect, CommentTreeAction} from '../state/comment_tree';
import {EntityComment, IEntityComment} from '../configs/entities/comment/comment--comment';
import {createEntityOfJsonapiMany, createEntityOfJsonapiOne} from '@dangular-common/rxjs/operators';
import {getEntityType} from '@dangular-common/entity/utils';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';


@Injectable()
export class CommentService implements ICommentService {

  constructor(
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    private store: Store<AppStateModule>
  ) {

  }

  createFilters(parent_id: string): IFilters {
    return {
      filters: [{field: ['pid', 'id'], value: parent_id}]
    };
  }

  createFiltersRoot(entity_id: string): IFilters {
    return {
      filters: [
        {field: ['entity_id', 'id'], value: entity_id},
        {field: ['is_root'], value: '1'}
      ],
      // conditions: [{path: ['thread'], value: '01/', operator: EConditionOperator.EQUAL}]
    };
  }

  loadNodeComments(node: ICommentNode): Observable<IEntityComment[]> {
    const {id, isRoot} = node;
    const load$: Observable<IJsonApiEntity[]> = isRoot ? this.loadRoot(id) : this.loadChildren(id);
    return load$.pipe(
      createEntityOfJsonapiMany(EntityComment),
    );
  }

  loadRoot(entity_id: string): Observable<IJsonApiEntity[]> {
    return this.entities.loadMany(ETypes.COMMENT, {filter: this.createFiltersRoot(entity_id)});
  }

  loadChildren(parent_id: string): Observable<IJsonApiEntity[]> {
    return this.entities.loadMany(ETypes.COMMENT, {filter: this.createFilters(parent_id)});
  }

  addChildren(parentId: string, children: IEntityComment[]) {
    if (children.length === 0) {
      return;
    }
    const ids = children.map((child) => child.id);
    this.store.dispatch(new CommentTreeAction.ChildrenAdd(parentId, ids));
  }

  setEntity(entity: IEntityBase) {
    this.entities.createJsonApiEntity(entity.type, entity)
      .toPromise().then((entity) => {
      // this.store.dispatch(new DataAction.AddMany(entity.type,[entity]));
    });
  }

  saveUpdate(comment: IEntityComment): Observable<IEntityComment> {
    return this.entities.saveUpdate<IEntityComment>(comment.type, comment.id, comment.getJsonApiDoc());
  }

  getChildrenIds(id: string) {
    return this.store.pipe(
      select(CommentTreeSelect.ChildrenIds, {id}),
      map((ids) => ids || [])
    );
  }


  nodeExpand(node: ICommentNode) {
    this.store.dispatch(new CommentTreeAction.ChildrenExpand(node));
  }

  nodeCollapse(node: ICommentNode) {
    this.store.dispatch(new CommentTreeAction.ChildrenCollapse(node));
  }

  public delete(comment: IEntityComment) {
    // this.store.delete(comment.id);
    // const parent = this.store.get(comment.parent.id);
    //
    // const index = parent.children.findIndex((item: IEntityComment) => item.id === comment.id);
    // parent.children.splice(index, 1);
    //
//    this.listChange.emit(parent.comment.id);
  }

  loadComment(id: string) {
    return this.entities.loadOne(ETypes.COMMENT, {id});
  }

  newComment(body: IFormattedBody, parent_id?: string) {
    return this.state.onCommonComplete().pipe(
      map((data) => {
        const {entity, field_name, uid} = data;
        const values: Partial<IEntityComment> = {
          entity_id: entity,
          field_name,
          body
        };
        return this.entities.createFromValues<IEntityComment>(EntityComment, values);
      })
    );
  }

  saveNew(comment: IEntityComment, parent_id?: string): Observable<IEntityComment> {
    return this.state.onCommonComplete().pipe(
      map((data) => {
        const {entity, field_name, uid} = data;

        comment.entity_id = entity;
        comment.entity_type = getEntityType(entity.type);
        comment.field_name = field_name;
        comment.uid = uid;
        if (parent_id) {
          comment.pid = {type: ETypes.COMMENT, id: parent_id};
        }
        return comment;
      }),
      switchMap((comment: IEntityComment) => this.entities.saveNew(comment.type, comment.getJsonApiDoc())),
      createEntityOfJsonapiOne(EntityComment)
    );
  }


}
