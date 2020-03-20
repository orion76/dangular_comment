import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, ICommentState, IStateCommentState} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {StateModule} from '../state.module';


export namespace CommentStateSelect {
  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IStateCommentState>('commentState');

  export const Items = createSelector(State, selectEntities);

  export const ItemsByIds = createSelector(
    Items,
    (items: Dictionary<ICommentState>, props: { ids: string[] }) => {
      return props.ids.reduce((acc, id) => {
        if (items[id]) {
          acc[id] = items[id];
        }
        return acc;
      }, {});
    }
  );

  export const Item = createSelector<StateModule, { id: string }, Dictionary<ICommentState>, ICommentState>(
    Items,
    (items, props: { id: string }) => items[props.id]
  );
}
