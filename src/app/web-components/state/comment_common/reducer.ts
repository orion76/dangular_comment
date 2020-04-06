import {CommentCommonAction} from './actions';
import {IEntityUser} from '../../services/user/types';
import {IEntityBase} from '@dangular-common/entity/types';
import TActions = CommentCommonAction.TActions;
import EActions = CommentCommonAction.EActions;

export const anonymousId = '71041348-8852-4ed0-9658-71d16089fb8c';

export interface IStateCommentCommon {
  uid: IEntityUser;
  entity: IEntityBase;
  field_name: string;
}


export const initialState: IStateCommentCommon = {
  uid: null,
  entity: null,
  field_name: null,
};


export function reducer(state: IStateCommentCommon = initialState, action: TActions) {

  switch (action.type) {
    case EActions.SET_USER: {
      const {uid} = action;
      state = {...state, uid};
      break;
    }
    case EActions.SET_FIELD_NAME: {
      const {field_name} = action;
      state = {...state, field_name};
      break;
    }
    case EActions.SET_ENTITY: {
      const {entity} = action;
      state = {...state, entity};
      break;
    }
  }

  return state;
}
