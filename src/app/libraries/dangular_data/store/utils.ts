import {IJsonApiEntity, IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {Dictionary} from '@ngrx/entity';

export function getEntities(response: IJsonApiEntityDoc): IJsonApiEntity[] {
  return Array.isArray(response.data) ? response.data : [response.data];
}

export function getEntity(response: IJsonApiEntityDoc): IJsonApiEntity {
  return response.data;
}

export function getEntityId(response: IJsonApiEntityDoc): string {
  const entity = getEntity(response);
  return entity.id;
}

export function toJsonApi(entity: IJsonApiEntity, all?: Dictionary<IJsonApiEntity>): IJsonApiEntityDoc {
  const response: IJsonApiEntityDoc = {data: entity};

  if (all && entity.relationships) {
    const included: IJsonApiEntity[] = [];
    Object.keys(entity.relationships.data).forEach((field: string) => {
      const rel: IJsonApiEntity = entity.relationships.data[field];
      if (all[rel.id]) {
        included.push(rel);
      }
    });
    if (included.length > 0) {
      response.included = included;
    }
    return response;
  }
}

export type TLoadState = 'success' | 'error';

export interface ILoadResult {
  action_id: number,
  status: TLoadState,
  entity_type: string,
  entity_id: string
}
