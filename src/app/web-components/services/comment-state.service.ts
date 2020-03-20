import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {StateModule} from '../state/state.module';
import {ICommentStateService} from './types';
import {Observable} from 'rxjs';
import {ICommentNode} from '../state/comment_tree/reducer';
import {CommentTreeSelect} from '../state/comment_tree/selector';
import {filter, take} from 'rxjs/operators';
import {IStateCommentCommon as ICommonState} from '../state/comment_common/reducer';
import {CommentCommonSelect} from '../state/comment_common/selector';
import {IEntityBase} from '@dangular-common/entity/types';
import {CommentCommonAction} from '../state/comment_common/actions';
import {CommentStateAction} from '../state/comment_state/actions';
import {CommentsSelect} from '../state/comments/selector';
import {IEntityComment} from '../comment/types';


@Injectable()
export class CommentStateService implements ICommentStateService {


  constructor(
    private store: Store<StateModule>
  ) {

  }

  getComment(id): Observable<IEntityComment> {
    // console.log('[COMMENT SUBSCRIBE]',id);
    return this.store.pipe(
      select(CommentsSelect.Comment, {id}),
      // tap((comment)=>console.log('!! getComment',id,comment ))
      // distinctUntilChanged((a: IEntityComment, b: IEntityComment) => a.changed === b.changed),
    );
  }

  onNodeExpanded(id: string, value: boolean): Observable<ICommentNode> {
    return this.store.pipe(
      select(CommentTreeSelect.Node, {id}),
      // filter((node) => node.expanded === value)
    );
  }

  onNodeAdded(id: string): Observable<ICommentNode> {
    return this.store.pipe(
      select(CommentTreeSelect.Node, {id}),
      filter(Boolean),
      take(1)
    );
  }

  nodeExpand(id: string) {
    this.store.dispatch(new CommentStateAction.Expand(id));
  }

  nodeCollapse(id: string) {
    this.store.dispatch(new CommentStateAction.Collapse(id));
  }


  commentState(id: string): Observable<ICommentNode> {
    return this.store.pipe(select(CommentTreeSelect.Node, {id}));
  }

  commonComplete(): Observable<ICommonState> {
    return this.store.pipe(
      select(CommentCommonSelect.State),
      filter((state: ICommonState) => {
        return !!state.uid && !!state.entity && !!state.field_name;
      }));
  }

  commonSetEntity(entity: IEntityBase) {
    this.store.dispatch(new CommentCommonAction.SetEntity(entity));
  }

  commonSetFieldName(field_name: string) {
    this.store.dispatch(new CommentCommonAction.SetFieldName(field_name));
  }
}
