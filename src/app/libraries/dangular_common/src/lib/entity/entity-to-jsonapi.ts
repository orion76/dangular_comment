import {IJsonApiAttributes, IJsonApiEntity, IJsonApiRelationship, IJsonApiRelationshipData} from '../types/jsonapi-response';
import {IEntity} from '@dangular-common/entity/types';


export function mergeInclude(input: IEntity[], data: IEntity[]): IEntity[] {
  return {...data, ...input};
}

export function mergeAttributes(input: IJsonApiAttributes, data: IJsonApiAttributes): IJsonApiAttributes {
  return {...data, ...input};
}

export function mergeRelationships(input: Record<string, IJsonApiRelationshipData>,
                                   data: Record<string, IJsonApiRelationshipData>): Record<string, IJsonApiRelationshipData> {

  const fields: Set<string> = new Set([...Object.keys(input), ...Object.keys(data)]);

  return Array.from(fields.values()).reduce((result: Record<string, IJsonApiRelationshipData>, field: string) => {
    const input_item = input[field];
    const data_item = data[field];
    if (input_item && data_item) {
      result[field] = mergeRelationship(input_item, data_item);
    } else {
      result[field] = input_item || data_item;
    }
    return result;
  }, {});
}

export function mergeRelationship(input: IJsonApiRelationshipData,
                                  data: IJsonApiRelationshipData): IJsonApiRelationshipData {

  if (isSingleValue(input.data, data.data)) {
    return {data: mergeRelationshipField(input.data as IJsonApiRelationship, data.data as IJsonApiRelationship)};
  }

  const input_items: IJsonApiRelationship[] = Array.isArray(input.data) ? input.data : [input.data];
  const data_items: IJsonApiRelationship[] = Array.isArray(data.data) ? data.data : [data.data];

  const input_map: Map<string, IJsonApiRelationship> = new Map();
  const data_map: Map<string, IJsonApiRelationship> = new Map();

  const input_ids: string[] = [];
  const data_ids: string[] = [];

  input_items.forEach((item: IJsonApiRelationship) => {
    input_map.set(item.id, item);
    input_ids.push(item.id);
  });
  data_items.forEach((item: IJsonApiRelationship) => {
    data_map.set(item.id, item);
    data_ids.push(item.id);
  });


  const diff_keys = input_ids
    .filter(x => !data_ids.includes(x))
    .concat(data_ids.filter(x => !input_ids.includes(x)));

  const intersects_keys = input_ids.filter(x => data_ids.includes(x));

  const result: IJsonApiRelationship[] = [];

  diff_keys.forEach((key: string) => {
    if (input_map.has(key)) {
      result.push(input_map.get(key));
    }

    if (data_map.has(key)) {
      result.push(data_map.get(key));
    }
  });

  intersects_keys.forEach((key) => {
    const input = input_map.get(key);
    const data = data_map.get(key);
    result.push(mergeRelationshipField(input, data));
  });

  return {data: result};
}

export function isSingleValue(input: any, data: any) {
  if (data) {
    return !Array.isArray(data);
  }

  if (input) {
    return !Array.isArray(input);
  }

  return false;
}

export function mergeRelationshipField(input: IJsonApiRelationship,
                                       data: IJsonApiRelationship): IJsonApiRelationship {
  let result: IJsonApiRelationship = {...input};
  if (!result && data) {
    result = {...data};
  }
  if (result.meta) {
    result.meta = {...result.meta};
  }
  return result;
}
