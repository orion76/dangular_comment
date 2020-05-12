import {IEntityConfig} from './types';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';


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

export function getEntityType(full_type: string) {
  return full_type.substring(0, full_type.indexOf('-'));
}

export function cloneObject(obj: any) {
  return JSON.parse(JSON.stringify(obj));
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
