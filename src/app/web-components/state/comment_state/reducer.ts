import {CommentStateAction} from './actions';
import {createEntityAdapter, EntityAdapter, Update} from '@ngrx/entity';
import {ICommentState, IStateCommentState} from './types';
import TActions = CommentStateAction.TActions;
import EActions = CommentStateAction.EActions;


export const adapter: EntityAdapter<ICommentState> = createEntityAdapter<ICommentState>({
  selectId: (item) => item.id,
});

export const initialState: IStateCommentState = adapter.getInitialState({
  uid: null,
  entity: null,
  field_name: null
});


function createUpdatesOneValue<K extends keyof ICommentState>(ids: string[], field: K, value: ICommentState[K]): ICommentState[] {
  return ids.map((id) => ({id, [field]: value}));
}

function createUpdates(values: Partial<ICommentState>[]): Update<ICommentState>[] {
  return values.map((item) => ({id: item.id, changes: item}));
}


export function reducerCommentState(state: IStateCommentState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.STATE_INIT_MANY: {
      const {comments} = action;
      state = adapter.addMany(comments, state);
      break;
    }
    case EActions.SET_CAN_REPLY: {
      const {ids} = action;
      state = adapter.upsertMany(createUpdatesOneValue(ids, 'can_reply', true), state);
      break;
    }
    case EActions.SET_EXPANDED: {
      const {ids, value} = action;
      state = adapter.upsertMany(createUpdatesOneValue(ids, 'expanded', value), state);
      break;
    }
    case EActions.SET_CHILD_COUNT: {
      const {values} = action;
      state = adapter.updateMany(createUpdates(values), state);
      break;
    }
    case EActions.STATE_DELETE: {
      const {ids} = action;
      state = adapter.removeMany(ids, state);
      break;
    }
    case EActions.SET_EDITABLE: {
      const {id, editable} = action;
      state = adapter.upsertOne({id, editable}, state);
      break;
    }
  }

  return state;
}
