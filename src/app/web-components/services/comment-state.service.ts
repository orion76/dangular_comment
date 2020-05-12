import {Inject, Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../app-state.module';
import {ICommentStateService} from './types';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {IEntityBase} from '@dangular-common/entity/types';
import {CommentStateAction, CommentStateSelect, ICommentState} from '../state/comment_state';
import {IEntityComment} from '../configs/entities/comment/comment--comment';
import {DataSelect} from '@dangular-data/store/entities/selector';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';
import {CommentGlobalAction, CommentGlobalSelect, IStateCommentGlobal} from '../state/comment_global';
import {log} from '@dangular-common/rxjs/operators';


@Injectable()
export class CommentStateService implements ICommentStateService {


  constructor(
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    private store: Store<AppStateModule>
  ) {

  }

  getComment(id): Observable<IEntityComment> {

    return this.store.pipe(
      select(DataSelect.Entity, {id}),
      switchMap((data: IJsonApiEntity) => this.entities.createFromResponseOne<IEntityComment>(data)),
      map((comment: IEntityComment) => comment)
    );
  }

  getCommentState(id): Observable<ICommentState> {
    return this.store.pipe(
      select(CommentStateSelect.Comment, {id}),
    );
  }

  setEditable(id: string, editable: boolean) {
    this.store.dispatch(new CommentStateAction.setEditable(id, editable));
  }

  addCommentStateMany(comments: IEntityComment[]) {
    const states: ICommentState[] = comments.map((comment)=>this.createCommentState(comment));
    this.store.dispatch(
      new CommentStateAction.StateInitMany(states));
  }

  createCommentState(comment:IEntityComment):ICommentState{
    const {id, child_count} = comment;
    return {id, child_count};
  }

  onCommonComplete(): Observable<IStateCommentGlobal> {
    return this.store.pipe(
      select(CommentGlobalSelect.State),
      filter((state: IStateCommentGlobal) => {
        return !!state.uid && !!state.entity && !!state.field_name;
      }));
  }

  commonSetEntity(entity: IEntityBase) {
    this.store.dispatch(new CommentGlobalAction.SetCommentedEntity(entity));
  }

  commonSetFieldName(field_name: string) {
    this.store.dispatch(new CommentGlobalAction.SetCommentFieldName(field_name));
  }
}
