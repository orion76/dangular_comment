import {IEntity, IEntityConfig} from './types';
import {IJsonApiEntity, IJsonApiResponse} from '@dangular-common/types/jsonapi-response';
import {ETypes} from '../../../../../web-components/configs/entities/types';

export function entityUUID(entity: IEntity) {
  return `${entity.type}--${entity.id}`;
}

export interface IEntityConstructor {
  new(type: string, configs: Record<string, IEntityConfig>)
}

export function createNew<T extends IEntity>(ctor: any, type: string, configs: Record<string, IEntityConfig>): T {
  if (!configs[type]) {
    return null;
  }
  return new ctor(type, configs);
}

export function entitySetValues<T>(entity: T, values: Partial<T>): T {
  Object.keys(values)
    .filter((key: string) => key !== 'type')
    .forEach((key: string) => entity[key] = values[key]);
  return entity;
}

export function createWithValues<T extends IEntity>(ctor: IEntityConstructor, type: string,
                                                    configs: Record<string, IEntityConfig>,
                                                    values?: Partial<T>): T {
  const entity = createNew<T>(ctor, type, configs);
  entitySetValues<T>(entity, values);
  return entity;
}

export function createFromResponse<T extends IEntity>(
  ctor: IEntityConstructor,
  configs: Record<string, IEntityConfig>,
  data: IJsonApiEntity,
  included: IJsonApiEntity[]
): T {
  const entity: T = createNew<T>(ctor, data.type, configs);
  entity.setResponse<T>(data, included);
  return entity;
}

export function setIn(obj: any, path: string[], value: any) {
  const _path = [...path];
  const last = _path.pop();
  _path.reduce((next, key) => {
    if (!next[key]) {
      next[key] = {};
    }
    return next[key];
  }, obj)[last] = value;
}

export function getIn(path: string[], value: any) {
  if (!value || path.length === 0) {
    return value;
  }
  let result = value;
  path.every((key) => {
    result = result[key] ? result[key] : null;
    return Boolean(result);
  });
  return result;
}

export function hasIn(path: string[], value: any) {
  if (!value || path.length === 0) {
    return false;
  }
  let result = value;
  path.every((key) => {
    result = result[key];
    return !!result;
  });
  return !!result;
}


export function selectValue(path: string[], input, data) {
  return getIn(path, input) || getIn(path, data);
}

export function mergeInputAndResponse(config: IEntityConfig,
                                      input: Partial<IJsonApiEntity>,
                                      data: Partial<IJsonApiEntity>): Partial<IJsonApiEntity> {
  const result: Partial<IJsonApiEntity> = {};

  if (config.attributes) {
    result.attributes = {};
    Object.keys(config.attributes).forEach((key: string) => {
      const path = ['attributes', key];
      const value = getIn(path, input) || getIn(path, data);
      if (value) {
        setIn(result, path, value);
      }
    });
  }

  if (config.relationships) {
    result.relationships = {};
    Object.keys(config.relationships).forEach((key: string) => {
      const path = ['relationships', key];
      const value = getIn(path, input) || getIn(path, data);
      if (value) {
        setIn(result, path, value);
      }
    });
  }

  return result;
}
