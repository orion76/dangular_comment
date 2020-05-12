import {Dictionary, EntityState} from '@ngrx/entity';
import {IJsonApiEntityDoc, IJsonApiEntity} from '@dangular-data/types/jsonapi-response';

export interface IEntityState {
  id: string;
  type: string;
  isNew?: boolean;
  entity?: IJsonApiEntity;
}

export interface IStateEntities extends EntityState<IJsonApiEntity> {
  mapOperationId: Dictionary<string[]>
}


export function getResponseEntityOne(response: IJsonApiEntityDoc): IJsonApiEntity {
  console.assert(!!response.data,'data response is empty');
  return Array.isArray(response.data) ? response.data[0] : response.data;
}

export function getResponseEntityMany(response: IJsonApiEntityDoc): IJsonApiEntity[] {
  return Array.isArray(response.data) ? response.data : [response.data];
}
