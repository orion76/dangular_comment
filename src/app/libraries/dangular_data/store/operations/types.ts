import {EntityState} from '@ngrx/entity';

export interface IOperation {
  operation_id: string;
  entity_type: string;
  entity_id?: string;
  entity_ids?: string[];
  complete?: boolean;
}

export interface IStateEntitiesOperations extends EntityState<IOperation> {
}


