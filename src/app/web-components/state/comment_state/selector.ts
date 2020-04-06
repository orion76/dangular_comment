import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, ICommentState, IStateCommentState} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {AppStateModule} from '../../../app-state.module';


export namespace CommentStateSelect {
  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IStateCommentState>('commentState');

  export const Items = createSelector(State, selectEntities);

  export const Comment = createSelector<AppStateModule, { id: string }, Dictionary<ICommentState>, ICommentState>(
    Items,
    (items, props: { id: string }) => items[props.id]
  );
}
