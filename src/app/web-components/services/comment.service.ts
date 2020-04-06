import {Inject, Injectable} from '@angular/core';
import {COMMENT_STATE_SERVICE, ICommentService, ICommentStateService} from './types';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IFormattedBody} from '../comment/types';
import {Observable, of} from 'rxjs';
import {IEntityBase} from '@dangular-common/entity/types';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../app-state.module';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {CommentsAction} from '../state/comments/actions';
import {CommentsSelect} from '../state/comments/selector';
import {ETypes} from '../configs/entities/types';
import {IFilters} from '@dangular-data/request/request.service';
import {CommentTreeAction} from '../state/comment_tree/actions';
import {IStateCommentCommon} from '../state/comment_common/reducer';
import {CommentTreeSelect} from '../state/comment_tree/selector';
import {ICommentNode} from '../state/comment_tree/reducer';
import {IEntityComment} from '../configs/entities/comment/comment--comment';

function EntityTypeWithoutBundle(entity_type: string): string {
  return entity_type.split('--')[0];
}

function getCommentParentId(comment: IEntityComment) {
  return comment.pid ? comment.pid.id : comment.entity_id.id;
}

function createCommentData(body: IFormattedBody, pid: IEntityComment) {
  return (commonValues: IStateCommentCommon) => {
    const {entity, uid, field_name} = commonValues;
    const values = {
      field_name,
      uid,
      entity_type: EntityTypeWithoutBundle(entity.type),
      entity_id: entity,
      body
    } as Partial<IEntityComment>;

    if (pid) {
      values.pid = pid;
    }
    return values;
  };

}

function isSetEqual(a: Set<string>, b: Set<string>) {
  const _a = new Set(a);
  const _b = new Set(b);
  [...a].forEach((item) => {
    if (b.has(item)) {
      _b.delete(item);
      _a.delete(item);
    }
  });

  return !_a.size && !_b.size;
}

function isChildrenUpdates(node_old: ICommentNode, node_new: ICommentNode) {

}

@Injectable()
export class CommentService implements ICommentService {


  constructor(
    @Inject(DATA_SERVICE) private data: IDataService,
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

  loadRoot(entity_id: string): Observable<IEntityComment[]> {
    // console.log('[LOAD] - root', {entity_id});
    return this.data.list(ETypes.COMMENT, {filter: this.createFiltersRoot(entity_id)});
  }

  loadChildren(parent_id: string): Observable<IEntityComment[]> {
    // console.log('[LOAD] - children', {parent_id});
    return this.data.list<IEntityComment>(ETypes.COMMENT, {filter: this.createFilters(parent_id)});
  }

  addChildren(parentId: string, children: IEntityComment[]) {
    if (children.length === 0) {
      return;
    }
    const ids = children.map((child) => child.id);
    this.store.dispatch(new CommentTreeAction.AddChildren(parentId, ids));
  }

  setEntity(entity: IEntityBase) {
    this.data.createWithValues(entity.type, entity)
      .toPromise().then((entity) => {
      this.store.dispatch(new CommentsAction.AddEntity(entity));
    });
  }

  saveUpdate(commentId: string, content: string): Observable<IEntityComment> {
    return this.store.pipe(
      take(1),
      select(CommentsSelect.Comment, {id: commentId}),
      switchMap((comment: IEntityComment) => {
        if (comment.body.value !== content) {
          comment.body.value = content;
          return this.data.update(comment);
        } else {
          return of(comment);
        }
      })
    );
  }

  getChildren(parentId: string): Observable<string[]> {
    return this.store.pipe(
      select(CommentTreeSelect.Nodes),
      map((nodes) => nodes[parentId] ? [...nodes[parentId].children] : null),
      // tap((children) => console.log('[getChildren]', {parentId, children})),
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

  isExistsParentComment(comment: IEntityComment): Observable<IEntityComment> {
    const load$ = comment.pid ? this.loadComment(comment.pid.id) : of(null);
    return load$.pipe(take(1), filter(Boolean));
  }

  loadComment(id: string): Observable<IEntityComment> {
    return this.data.one(ETypes.COMMENT, {id});
  }

  saveNew(body: IFormattedBody, pid?: IEntityComment): Observable<IEntityComment> {
    return this.state.commonComplete()
      .pipe(
        map(createCommentData(body, pid)),
        switchMap((data: Partial<IEntityComment>) => this.data.createWithValues<IEntityComment>(ETypes.COMMENT, data)),
        switchMap((comment: IEntityComment) => this.data.add<IEntityComment>(comment)),
        tap((comment: IEntityComment) => this.store.dispatch(new CommentsAction.CommentAdd(comment))),
        tap((comment: IEntityComment) => this.state.setEditable(comment.id, true)),
        take(1)
      );
  }


}
