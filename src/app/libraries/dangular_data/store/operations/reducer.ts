import {OperationAction} from './actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {IOperation, IStateEntitiesOperations} from '@dangular-data/store/operations/types';
import TActions = OperationAction.TActions;
import EActions = OperationAction.EActions;


export const adapter: EntityAdapter<IOperation> = createEntityAdapter<IOperation>({
  selectId: (entity) => entity.operation_id,
});

export const initialState: IStateEntitiesOperations = adapter.getInitialState({
  mapOperationId: {}
});


export function reducerEntitiesOperations(state: IStateEntitiesOperations = initialState, action: TActions) {

  switch (action.type) {

    case EActions.OPERATION_COMPLETE: {
      const {operation_id} = action;
      state = adapter.updateOne({id: operation_id, changes: {complete: true}}, state);
      break;
    }

    case EActions.SAVE_NEW_SUCCESS: {
      const {operation_id, entity_type, entity_id} = action;

      state = adapter.addOne({operation_id, entity_type, entity_id}, state);
      break;
    }
    case EActions.SAVE_UPDATE_SUCCESS: {
      const {operation_id, entity_type, entity_id} = action;
      state = adapter.addOne({operation_id, entity_type, entity_id}, state);
      break;
    }
    case EActions.LOAD_ONE_SUCCESS: {
      const {operation_id, entity_type, entity_id} = action;
      const operation: IOperation = {operation_id, entity_type, entity_id};
      state = adapter.addOne(operation, state);
      break;
    }

    case EActions.LOAD_MANY_SUCCESS: {
      const {operation_id, entity_type, entity_ids} = action;
      const operation: IOperation = {operation_id, entity_type, entity_ids};
      state = adapter.addOne(operation, state);
      break;
    }
  }

  return state;
}
