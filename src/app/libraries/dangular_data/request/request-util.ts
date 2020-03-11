import {getIn} from '@dangular-common/entity/utils';
import {ICondition, IFilter} from '@dangular-data/request/request.service';
import {IRequestPointConfig} from '@dangular-data/request/types';

export function addInclude(params: Record<string, string>, config: IRequestPointConfig, query: IRequestPointConfig) {
  const configInclude = config.include ? config.include : [];
  const queryInclude = query && query.include ? query.include : [];

  const include = Array.from(
    queryInclude.reduce((inc, item) => inc.add(item), new Set(configInclude)).values()
  );

  params.include = include.join(',');
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


export function addCondition(params: Record<string, string>, condition: ICondition) {
  return createConditionNames(condition.path)
    .forEach(({key, name}) => params[name] = condition[key] as string);
}


export function StringToArray(value: string | string[]): string[] {
  return typeof value === 'string' ? [value] : value;
}
