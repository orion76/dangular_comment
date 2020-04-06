import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {VoteStateAction} from '@dangular-components/vote/state/actions';
import {IEntityVote, IEntityVoteRes} from '@dangular-components/vote/types';
import TActions = VoteStateAction.TActions;
import EActions = VoteStateAction.EActions;


export interface IVoteState<T extends IEntityVoteRes> {
  enabled: boolean;
  vote_result: T;
  user_vote: IEntityVote
}

export type TVoteState = IVoteState<IEntityVoteRes>;

export interface IEntityStateVote extends EntityState<IVoteState<IEntityVoteRes>> {
}

export const adapter: EntityAdapter<IVoteState<IEntityVoteRes>> = createEntityAdapter<IVoteState<IEntityVoteRes>>({
  selectId: (item) => item.vote_result.id,
});

export const initialState: IEntityStateVote = adapter.getInitialState({});


export function reducer(state: IEntityStateVote = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_RESULT: {
      const {item} = action;
      state = adapter.addOne(item, state);
      break;
    }
    case EActions.ADD_RESULTS: {
      const {entities} = action;
      state = adapter.addMany(entities, state);
      break;
    }
  }
  return state;
}
