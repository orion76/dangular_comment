import {Inject, Injectable} from '@angular/core';
import {ICommentService} from './types';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IEntityComment} from '../comment/types';
import {Observable} from 'rxjs';
import {IEntity, IEntityBase} from '@dangular-common/entity/types';
import {select, Store} from '@ngrx/store';
import {AppState} from '../state/app.state';

import {EConditionOperator} from '@dangular-data/request/jsonapi-request';
import {filter, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {EntitiesAction} from '../state/entities/actions';
import {EntitiesSelect} from '../state/entities/selector';
import {ETypes} from '../configs/entities/types';
import {IUserService, USER_SERVICE} from './user/types';
import {IFilters} from '@dangular-data/request/request.service';

export interface IComment {
  comment: IEntityComment;
  children: IEntityComment[];
}

@Injectable()
export class CommentService implements ICommentService {


  constructor(
    @Inject(DATA_SERVICE) private data: IDataService,
    @Inject(USER_SERVICE) private user: IUserService,
    private store: Store<AppState>
  ) {

  }

  entityOwner(): Observable<IEntity> {
    return this.store.pipe(select(EntitiesSelect.EntityOwner), filter(Boolean));
  }

  loadEntity(entity_type: string, entity_id) {
    this.data.one(entity_type, entity_id);
  }

  createFilters(parent_id: string): IFilters {
    return {
      filters: [{field: ['pid', 'id'], value: parent_id}]
    };
  }

  createFiltersRoot(entity_id: string): IFilters {
    return {
      filters: [{field: ['entity_id', 'id'], value: entity_id}],
      conditions: [{path: ['pid', 'id'], operator: EConditionOperator.IS_NULL}]
    };
  }

  loadRoot(entity_id: string) {
    this.data.list('comment', this.createFiltersRoot(entity_id))
      .pipe(take(1))
      .subscribe((comments: IEntityComment[]) => {
        this.store.dispatch(new EntitiesAction.AddComments(comments));
      });
  }

  loadChildren(parent_id: string): Observable<IEntityComment[]> {
    return this.data.list(ETypes.COMMENT, this.createFilters(parent_id));
  }

  setEntity(entity: IEntityBase) {
    this.data.createWithValues(entity.type, entity)
      .pipe(
        take(1))
      .subscribe((entity) => {
        this.store.dispatch(new EntitiesAction.AddEntity(entity));
      });
  }


  // onListChange(parentId: string): Observable<IEntityComment[]> {
  //   return this.listChange.pipe(
  //     filter((id: string) => parentId === id),
  //     map((parentId) => this.store.get(parentId).children)
  //   );
  // }

  saveUpdate(commentId: string, content: string): Observable<IEntityComment> {
    return this.store
      .pipe(
        select(EntitiesSelect.Comment, {id: commentId}),
        switchMap((comment) => this.data.update(comment))
      );
  }

  getChildren(parentId: string): Observable<IEntityComment[]> {
    return this.store.pipe(
      select(EntitiesSelect.CommentChildren, {id: parentId}),
      filter((children: IEntityComment[]) => children.length > 0),
    );
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

  saveNew(parentId: string, body: string): Observable<IEntityComment> {
    return this.user.loggedUser()
      .pipe(
        withLatestFrom(this.entityOwner(), (uid, entity) => {
          return {parentId, uid, entity_type: entity.type, entity_id: entity.id, body};
        }),
        switchMap((data: Partial<IEntityComment>) => this.data.createWithValues<IEntityComment>(ETypes.COMMENT, data)),
        switchMap((comment: IEntityComment) => this.data.add<IEntityComment>(comment)),
        tap((comment: IEntityComment) => this.store.dispatch(new EntitiesAction.AddComments([comment]))),
        take(1)
      );
  }

}
