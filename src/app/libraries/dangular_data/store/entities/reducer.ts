import {DataAction} from './actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {IJsonApiEntity} from '../../types/jsonapi-response';
import {IEntityState, IStateEntities} from '@dangular-data/store/entities/types';
import TActions = DataAction.TActions;
import EActions = DataAction.EActions;

function createEntityState(id: string, entity: IJsonApiEntity): IEntityState {
  return {id, type: entity.type, entity};
}

export const adapter: EntityAdapter<IJsonApiEntity> = createEntityAdapter<IJsonApiEntity>({
  selectId: (entity) => entity.id,
});

export const initialState: IStateEntities = adapter.getInitialState({
  mapOperationId: {}
});


export function reducerEntities(state: IStateEntities = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_ONE: {
      const {entity} = action;
      state = adapter.addOne(entity, state);
      break;
    }
    case EActions.ADD_MANY: {
      const {entities} = action;
      state = adapter.addMany(entities, state);
      break;
    }

  }

  return state;
}
