import {LoggedUsersAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IEntityUser} from '../../services/user/types';
import TActions = LoggedUsersAction.TActions;
import EActions = LoggedUsersAction.EActions;

export const anonymousId = '71041348-8852-4ed0-9658-71d16089fb8c';

export interface IState extends IEntityUser {

}


export const initialState: IState = null;


export function reducer(state: IState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.SET: {
      const {user} = action;
      state = user;
      break;
    }
  }

  return state;
}
