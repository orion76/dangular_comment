import {IStateCommentGlobal} from './types';
import {CommentGlobalAction} from './actions';
import TActions = CommentGlobalAction.TActions;
import EActions = CommentGlobalAction.EActions;


export const initialState: IStateCommentGlobal = {
  uid: null,
  entity: null,
  field_name: null
};

export function reducerCommentGlobal(state: IStateCommentGlobal = initialState, action: TActions) {

  switch (action.type) {

    case EActions.SET_CURRENT_USER: {
      const {uid} = action;
      state = {...state, uid};
      break;
    }
    case EActions.SET_COMMENT_FIELD_NAME: {
      const {field_name} = action;
      state = {...state, field_name};
      break;
    }
    case EActions.SET_COMMENTED_ENTITY: {
      const {entity} = action;
      state = {...state, entity};
      break;
    }
  }

  return state;
}
