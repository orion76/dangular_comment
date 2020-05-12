import {IJsonApiEntity, IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';

export interface IEntityBase {
  id: string;
  type: string;
}

export interface IEntity extends IEntityBase {
  label: string;

  setValues<T extends IEntity>(values: Partial<T>);

  isChanged(): boolean;

  setJsonApi<T extends IEntity>(data: IJsonApiEntity);

  getJsonApiEntity(): IJsonApiEntity;
  getJsonApiDoc(): IJsonApiEntityDoc;
  getJsonApiIncluded(): IJsonApiEntity[];
}

export type TEntityFieldType = 'string' | 'integer' | 'text' | 'boolean' | 'datetime' | 'object';

export interface IEntityFieldConfig {
  label: string;
}

export interface IEntityAttributeConfig extends IEntityFieldConfig {
  type: TEntityFieldType;
}

export interface IEntityRelationshipConfig extends IEntityFieldConfig {
  type: string;
  included?: boolean;
}

export interface IEntityConfig {
  type: string;
  attributes?: Record<string, IEntityAttributeConfig>;
  relationships?: Record<string, IEntityRelationshipConfig>;
}

// export type TAttributeName<A> = 'label' |  keyof A;
// export type TRelationshipName<R> = keyof R;
// export type TFieldName<A, R> = TAttributeName<A> | TRelationshipName<R>;
