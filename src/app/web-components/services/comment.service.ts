import {Inject, Injectable} from '@angular/core';
import {ICommentService} from './types';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IEntityComment} from '../comment/types';
import {Observable, of} from 'rxjs';
import {IEntity, IEntityBase} from '@dangular-common/entity/types';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../state/IAppState';

import {CommentTreeSelect} from '../state/comment_tree/selector';

import {EConditionOperator} from '@dangular-data/request/jsonapi-request';
import {catchError, filter, map, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
import {EntitiesAction} from '../state/entities/actions';
import {EntitiesSelect} from '../state/entities/selector';
import {ETypes} from '../configs/entities/types';
import {IEntityUser} from './user/types';
import {LoggedUsersSelect} from '../state/logged_user/selector';
import {IFilter, IFilters} from '@dangular-data/request/request.service';

export interface IComment {
  comment: IEntityComment;
  children: IEntityComment[];
}

@Injectable()
export class CommentService implements ICommentService {


  entities$ = this.store.pipe(select(EntitiesSelect.Entities));
  nodes$ = this.store.pipe(select(CommentTreeSelect.Nodes));

  constructor(
    @Inject(DATA_SERVICE) private data: IDataService,
    private store: Store<IAppState>
  ) {

  }

  loggedUser(): Observable<IEntityUser> {
    return this.store.pipe(select(LoggedUsersSelect.User), filter(Boolean));
  }

  entityOwner(): Observable<IEntity> {
    return this.store.pipe(select(EntitiesSelect.EntityOwner), filter(Boolean));
  }

  loadEntity(entity_type: string, entity_id) {
    this.data.one(entity_type, entity_id);
  }

  createFilters(parent_id: string): IFilters {
    return{
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

  loadChildren(parent_id: string) {
    return this.data.list('comment', this.createFilters(parent_id));
  }

  setEntity(entity: IEntityBase) {
    console.log('[debug] setEntity', entity);

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

  saveUpdate(commentId: string, content: string) {
    this.store
      .pipe(select(EntitiesSelect.Comment, {id: commentId}))
      .subscribe((comment) => this.data.update(comment));
  }

  getSiblings(parentId: string): Observable<IEntityComment[]> {
    return this.store.pipe(
      select(EntitiesSelect.CommentChildren, {id: parentId}),
      // tap((data) => console.log('2222', data)),
      filter((children: IEntityComment[]) => children.length > 0),
      tap((data) => console.log('3333', data))
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

  saveNew(parentId: string, body: string) {
    this.loggedUser()
      .pipe(
        withLatestFrom(this.entityOwner(), (uid, entity) => {

          return {
            parentId,
            uid,
            entity_type: entity.type,
            entity_id: entity.id,
            body
          };
        }),
        switchMap((data: Partial<IEntityComment>) => this.data.createWithValues<IEntityComment>(ETypes.COMMENT, data)),
        switchMap((comment: IEntityComment) => this.data.add<IEntityComment>(comment)),
        take(1)
      )
      .toPromise()
      .then((comment: IEntityComment) => this.store.dispatch(new EntitiesAction.AddComments([comment])));
  }

}
