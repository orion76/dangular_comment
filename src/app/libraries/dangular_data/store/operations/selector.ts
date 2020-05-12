import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {AppStateModule} from '../../../../app-state.module';

import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';
import {IOperation, IStateEntitiesOperations} from '@dangular-data/store/operations/types';


export namespace OperationSelect {

  export const State = createFeatureSelector<IStateEntitiesOperations>('entities_operations');

  const {selectEntities} = adapter.getSelectors();

  export const Operations = createSelector<AppStateModule, IStateEntitiesOperations, Dictionary<IOperation>>(State, selectEntities);
  export const Operation = createSelector<AppStateModule, { operation_id: string }, Dictionary<IOperation>, IOperation>(
    Operations,
    (entities, props) => entities[props.operation_id]
  );

  export const OperationComplete = createSelector<AppStateModule, { operation_id: string }, Dictionary<IOperation>, boolean>(
    Operations,
    (entities, props) => entities[props.operation_id].complete
  );

}
