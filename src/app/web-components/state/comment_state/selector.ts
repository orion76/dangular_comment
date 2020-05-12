import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {AppStateModule} from '../../../app-state.module';
import {ICommentState, IStateCommentState} from './types';


export namespace CommentStateSelect {
  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IStateCommentState>('commentState');

  export const Comments = createSelector(State, selectEntities);

  export const CommentsByIds = createSelector<AppStateModule, { ids: string[] }, Dictionary<ICommentState>, ICommentState[]>(
    Comments,
    (comments: Dictionary<ICommentState>, {ids}) => ids.map((id: string) => comments[id])
  );

  export const Comment = createSelector<AppStateModule, { id: string }, Dictionary<ICommentState>, ICommentState>(
    Comments,
    (comments, {id}) => comments[id]
  );
}
