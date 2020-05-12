import {ConfigEntityAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {IEntityConfig} from '@dangular-common/entity/types';
import TActions = ConfigEntityAction.TActions;
import EActions = ConfigEntityAction.EActions;


export interface IStateConfigEntity extends EntityState<IEntityConfig> {
  entityId: string
}

export const adapter: EntityAdapter<IEntityConfig> = createEntityAdapter<IEntityConfig>({
  selectId: (config) => config.type,
});

export const initialState: IStateConfigEntity = adapter.getInitialState({entityId: null});


export function reducerConfigEntity(state: IStateConfigEntity = initialState, action: TActions) {

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
