import {CommentStateAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import TActions = CommentStateAction.TActions;
import EActions = CommentStateAction.EActions;

export interface ICommentStates {
  loaded?: boolean;
  expanded?: boolean;
  hidden?: boolean;
}


export interface ICommentState extends ICommentStates {
  id: string;
}

export interface IStateCommentState extends EntityState<ICommentState> {
}

export const adapter: EntityAdapter<ICommentState> = createEntityAdapter<ICommentState>({
  selectId: (item) => item.id,
});

export const initialState: IStateCommentState = adapter.getInitialState({});


function createUpdates<K extends keyof ICommentState>(ids: string[],
                                                      field: K,
                                                      value: ICommentState[K],
                                                      state: IStateCommentState
): ICommentState[] {

  return ids.map((id) => {
    const item: ICommentState = state[id] || {id};
    return {...item, [field]: value};
  });
}


export function reducer(state: IStateCommentState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.EXPAND: {
      const {id} = action;
      state = adapter.upsertMany(createUpdates([id], 'expanded', true, state), state);
      break;
    }
    case EActions.COLLAPSE: {
      const {id} = action;
      state = adapter.upsertMany(createUpdates([id], 'expanded', false, state), state);
      break;
    }
    case EActions.HIDDEN: {
      const {ids} = action;
      state = adapter.upsertMany(createUpdates(ids, 'hidden', true, state), state);
      break;
    }
    case EActions.VISIBLE: {
      const {ids} = action;
      state = adapter.upsertMany(createUpdates(ids, 'hidden', false, state), state);
      break;
    }
    case EActions.STATE_DELETE: {
      const {ids} = action;
      state = adapter.removeMany(ids, state);
      break;
    }
    case EActions.CHILDREN_LOADED: {
      const {ids} = action;
      state = adapter.upsertMany(createUpdates(ids, 'loaded', true, state), state);
      break;
    }
    case EActions.CHILDREN_NOT_LOADED: {
      const {ids} = action;
      state = adapter.upsertMany(createUpdates(ids, 'loaded', false, state), state);
      break;
    }

    default:
      state = {...state};
  }

  return state;
}
