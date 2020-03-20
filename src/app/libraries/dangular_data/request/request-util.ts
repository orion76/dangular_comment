import {getIn} from '@dangular-common/entity/utils';
import {ICondition, IFilter} from '@dangular-data/request/request.service';
import {IRequestPointConfig} from '@dangular-data/request/types';

export function addInclude(params: Record<string, string>, config: IRequestPointConfig, query: IRequestPointConfig) {
  const configInclude = config.include ? config.include : [];
  const queryInclude = query && query.include ? query.include : [];

  const include = Array.from(
    queryInclude.reduce((inc, item) => inc.add(item), new Set(configInclude)).values()
  );
  if (include.length > 0) {
    params.include = include.join(',');
  }

}

export function addFilters(params: Record<string, string>, config: IRequestPointConfig, query: IRequestPointConfig) {
  const configFilters = getIn(['filter', 'filters'], config) || [];
  const queryFilters = getIn(['filter', 'filters'], query) || [];
  [...configFilters, ...queryFilters].forEach((filter: IFilter) => addFilter(params, filter));
}


export function addConditions(params: Record<string, string>, config: IRequestPointConfig, query: IRequestPointConfig) {
  const configCond = getIn(['filter', 'conditions'], config) || [];
  const queryCond = getIn(['filter', 'conditions'], query) || [];
  [...configCond, ...queryCond].forEach((filter: ICondition) => addCondition(params, filter));
}


export function addFilter(params: Record<string, string>, filter: IFilter) {
  const field = `filter[${StringToArray(filter.field).join('.')}]`;
  params[field] = StringToArray(filter.value).join(',');
}

export function createConditionPrefix(_path: string | string[]) {
  const path = StringToArray(_path).join('.');
  const name = path.replace(/[^a-z0-9]+/, '-');
  return `filter[${name}][condition]`;
}


export function createConditionNames(path: string | string[]): { key: keyof ICondition, name: string }[] {
  const prefix = createConditionPrefix(path);
  const keys: (keyof ICondition)[] = ['path', 'value', 'operator'];
  return keys.map((key) => ({key, name: `${prefix}[${key}]`}));
}

function ArrayToString(arr: string | string[], delimiter: string): string {
  return (Array.isArray(arr) ? (arr as string[]).join(delimiter) : arr);
}

/*
* http://localhost:4200/jsonapi/comment/comment?
*   include=uid,uid.user_picture
*   &filter[entity_id.id]=89c0e307-4942-48de-930e-fdba1ca7f5ae
*   &filter[pid-id][condition][path]=pid,id
*   &filter[pid-id][condition][value]=undefined
*   &filter[pid-id][condition][operator]=IS%20NULL
*
* http://localhost:4200/jsonapi/comment/comment?include=uid,uid.user_picture&filter%5Bentity_id.id%5D=89c0e307-4942-48de-930e-fdba1ca7f5ae
* */

export function addCondition(params: Record<string, string>, condition: ICondition) {
  createConditionNames(condition.path)
    .filter(({key, name}) => !!condition[key])
    .forEach(({key, name}) => {
      switch (key) {
        case 'path':
          params[name] = ArrayToString(condition[key], '.');
          break;

        case 'value':
          params[name] = ArrayToString(condition[key], ',');
          break;

        case 'operator':
          params[name] = condition[key] as string;
          break;
      }
    });
}


export function StringToArray(value: string | string[]): string[] {
  return typeof value === 'string' ? [value] : value;

}
