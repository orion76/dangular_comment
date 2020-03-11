import {ConfigRequestAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';

import TActions = ConfigRequestAction.TActions;
import EActions = ConfigRequestAction.EActions;
import {IRequestConfig} from '@dangular-data/request/types';


export interface IState extends EntityState<IRequestConfig> {
  entityId: string
}

export const adapter: EntityAdapter<IRequestConfig> = createEntityAdapter<IRequestConfig>({
  selectId: (config) => config.type,
});

export const initialState: IState = adapter.getInitialState({entityId: null});


export function reducer(state: IState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD: {
      const {config} = action;
      state = adapter.addOne(config, state);
      break;
    }
    case EActions.ADD_MANY: {
      const {configs} = action;
      state = adapter.addMany(configs, state);
      break;
    }
    default:
      state = {...state};
  }

  return state;
}
