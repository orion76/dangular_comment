import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IEntityStateVote} from './reducer';


export namespace VoteStateSelect {
  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IEntityStateVote>('voteState');

  export const Items = createSelector(State, selectEntities);

  export const Like = createSelector(
    Items,
    (items, props: { id: string }) => items[props.id]
  );
}
