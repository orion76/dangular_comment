export interface IJsonApiRelationship {
  type: string;
  id: string;
  meta?: any
}

export interface IJsonApiRelationshipData {
  data: IJsonApiRelationship | IJsonApiRelationship[]
}

export interface IJsonApiAttributes {
  [K: string]: string | number | boolean
}

export interface IJsonApiEntity extends IJsonApiRelationship {
  attributes?: IJsonApiAttributes;
  relationships?: Record<string, IJsonApiRelationshipData>;
}

export interface IJsonApiCollectionDoc {
  jsonapi?: { version: string },
  data: IJsonApiEntity[];
  included?: IJsonApiEntity[];
}


export interface IJsonApiEntityDoc {
  jsonapi?: { version: string },
  data: IJsonApiEntity;
  included?: IJsonApiEntity[];
}
