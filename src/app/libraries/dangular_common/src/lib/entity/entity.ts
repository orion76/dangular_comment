import {IEntity, IEntityConfig, IEntityRelationshipConfig} from './types';
import {createFromResponse, getIn, hasIn, selectValue, setIn} from '@dangular-common/entity/utils';
import {IJsonApiEntity, IJsonApiRelationship, IJsonApiRelationshipData, IJsonApiResponse} from '@dangular-common/types/jsonapi-response';
import {mergeAttributes, mergeRelationships} from '@dangular-common/entity/entity-to-jsonapi';


export class Entity implements IEntity {
  protected input: Partial<IJsonApiEntity>;
  protected data: Partial<IJsonApiEntity>;
  protected includes: IJsonApiEntity[];
  protected entities: Record<string, IEntity>;

  protected configSelf: IEntityConfig;

  constructor(protected _type: string, protected configs: Record<string, IEntityConfig>) {

    if (!configs[_type]) {
      console.error('[entity] EntityConfig for missing for type:', _type);
    }
    this.configSelf = configs[_type];
    this.initProperties(this.configSelf);

    // const included = this.getIncludedRelationships(this.configSelf.relationships);

  }

  get label(): string {
    return this.selectAttribute('label') as string;
  };

  get id(): string {
    return selectValue(['id'], this.input, this.data);
  };

  set id(id: string) {
    setIn(this, ['input', 'id'], id);
  };

  get type(): string {
    return this.configSelf.type;
  };

  isChanged(): boolean {
    return Boolean(this.input) || Boolean(this.entities);
  }

  initIncluded(relationships: Record<string, IEntityRelationshipConfig>, configs: Record<string, IEntityConfig>) {
    // Object.keys(relationships).forEach((field) => {
    //   const index = configs.findIndex((entity) => entity.type === relationships[field].type);
    //   if (index > 0) {
    //     this.entities[field] = Object.create(configs[index]);
    //   }
    // });
  }

  getIncludedRelationships(relationships: Record<string, IEntityRelationshipConfig>) {
    const included: Record<string, IEntityRelationshipConfig> = {};
    return Object.keys(relationships).reduce((acc, key: string) => {
      if (relationships[key].included) {
        acc[key] = relationships[key];
      }
      return acc;
    }, {});
  }

  relationshipDataToArray(data: IJsonApiRelationshipData): IJsonApiRelationship[] {
    return Object.keys(data).reduce((items: IJsonApiRelationship[], fieldName: string) => {
      const rel: IJsonApiRelationship[] = Array.isArray(data[fieldName]) ? data[fieldName] : [data[fieldName]];
      return items.concat(rel);
    }, []);
  }

  setResponse<T extends IEntity>(data: IJsonApiEntity, includes: IJsonApiEntity[]) {

    this.data = {...data};
    this.includes = includes;

    if (getIn(['data', 'relationships', 'data'], this)) {
      const relationships: IJsonApiRelationshipData = this.data.relationships.data;

      Object.keys(relationships).forEach((field) => {
        this.relationshipDataToArray(relationships).forEach((relationship: IJsonApiRelationship) => {
          const rel_data = this.getIncludedData(relationship.id, relationship.type, includes);
          if (rel_data) {
            this.entities[field].setResponse(rel_data, includes);
          }
        });
      });
    }

    return this;
  }

  getIncludedData(id: string, type: string, includes: IJsonApiEntity[]) {
    const index = includes.findIndex((inc) => inc.type === type && inc.id === id);
    if (index >= 0) {
      return includes[index];
    }
  }

  setValues<T extends IEntity>(values: Partial<T>) {
    Object.keys(values).forEach((key: string) => this[key] = values[key]);
  }

  set(field: string, value: any) {
    const section = this.getFieldSection(field);

    switch (section) {
      case 'attributes':
        setIn(this, ['input', 'attributes', field], value);
        break;
      case 'relationships':
        const {id, type} = value;
        setIn(this, ['input', 'relationships', field], {id, type});
        if (value instanceof Entity) {
          setIn(this, ['entities', field], value);
        }
        break;
    }
  }


  get(field: string) {
    const section = this.getFieldSection(field);


    if (section === 'attributes') {
      return getIn(['input', section, field], this) || getIn(['data', section, field], this);
    }

    if (section === 'relationships') {

      return this.getRelationship(field);
    }

  }

  getFieldSection(field: string): string {
    if (getIn(['configSelf', 'attributes', field], this)) {
      return 'attributes';
    }

    if (getIn(['configSelf', 'relationships', field], this)) {
      return 'relationships';
    }
  }

  selectAttribute(name: string) {
    return getIn(['input', 'attributes', name], this) || getIn(['data', 'attributes', name], this);
  }

  toJsonApi(): IJsonApiResponse {
    const {id, type} = this;
    const data: IJsonApiResponse = {
      data: [{
        id,
        type,
        attributes: mergeAttributes(this.input.attributes, this.data.attributes),
        relationships: mergeRelationships(this.input.relationships, this.data.relationships),
      }],
    };

    return data;
  }

  protected initProperties(config: IEntityConfig) {
    ['attributes', 'relationships']
      .filter((section) => Boolean(config[section]))
      .forEach((section: string) => {
        Object.keys(config[section]).forEach((field_name: string) => {
          Object.defineProperty(this, field_name, {
            get: () => this.get(field_name),
            set: (value) => this.set(field_name, value)
          });
        });
      });
  }

  protected createEntity(relationship: IJsonApiRelationship): IEntity {
    const data = this.includes.find((item) => item.id === relationship.id);
    const response: IJsonApiResponse = {
      included: this.includes,
      data: [data]
    };
    return createFromResponse(Entity, this.configs, response)[0];
  }

  protected getEntity(relationship: IJsonApiRelationship) {
    if (!this.entities || !this.entities[relationship.id]) {
      this.entities = this.entities || {};
      this.entities[relationship.id] = this.createEntity(relationship);
    }
    return this.entities[relationship.id];
  }

  protected isFieldExist(field: string) {
    const section = this.getFieldSection(field);
    return !!getIn(['configSelf', section, field], this);
  }


  protected isFieldValueExist(field: string) {
    const section = this.getFieldSection(field);

    if(field==='uid'){
      debugger;
    }
    return !!(hasIn(['input', section, field], this) || hasIn(['data', section, field], this));
  }

  protected getRelationship(field: string) {
    if (!this.isFieldExist(field)) {
      console.error('[entity]', 'Field is missing in entity', {field, entity_type: this.type});
    }

    if (!this.isFieldValueExist(field)) {
      return null;
    }

    if (this.configSelf.relationships[field].included) {
      if (Array.isArray(this.data.relationships[field].data)) {
        const list: IJsonApiRelationship[] = this.data.relationships[field].data as IJsonApiRelationship[];
        return list.map((data) => this.getEntity(data));
      } else {
        const item: IJsonApiRelationship = this.data.relationships[field].data as IJsonApiRelationship;
        return this.getEntity(item);
      }
    } else {
      return selectValue(['relationships', field], this.input, this.data);
    }
  }
}
