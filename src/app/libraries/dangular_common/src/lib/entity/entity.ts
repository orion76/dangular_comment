import {IEntity, IEntityConfig, IEntityRelationshipConfig} from './types';
import {createFromResponse, getIn, selectValue, setIn} from '@dangular-common/entity/utils';
import {IJsonApiAttributes, IJsonApiEntity, IJsonApiRelationship, IJsonApiRelationshipData, IJsonApiResponse} from '@dangular-common/types/jsonapi-response';
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
        if(!value){
          debugger;
        }
        const {id, type} = value;
        setIn(this, ['input', 'relationships', field, 'data'], {id, type});
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

  selectRelationship(name: string) {
    const value = getIn(['input', 'relationships', name], this) || getIn(['data', 'relationships', name], this);

    return value;
  }

  toJsonApi(): IJsonApiEntity {
    const {id, type} = this;

    const input_attributes: IJsonApiAttributes = (this.input && this.input.attributes) ? this.input.attributes : {};
    const data_attributes: IJsonApiAttributes = (this.data && this.data.attributes) ? this.data.attributes : {};
    const input_relationships: Record<string, IJsonApiRelationshipData> = (this.input && this.input.relationships) ? this.input.relationships : {};
    const data_relationships: Record<string, IJsonApiRelationshipData> = (this.data && this.data.relationships) ? this.data.relationships : {};


    const data: IJsonApiEntity = {
      id, type,
      attributes: mergeAttributes(input_attributes, data_attributes),
      relationships: mergeRelationships(input_relationships, data_relationships),
    };

    return data;
  }

  findIncluded(id: string) {
    return this.includes ? this.includes.find((item) => item.id === id) : null;
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
    const {id, type} = relationship;
    const data = this.findIncluded(id) || {id, type};
    const entity = createFromResponse(Entity, this.configs, data, this.includes);
    return entity;
  }

  protected getEntity(field: string, relationship: IJsonApiRelationship) {
    if (!this.entities || !this.entities[field]) {
      this.entities = this.entities || {};
      setIn(this, ['entities', field], this.createEntity(relationship));
    }
    return getIn(['entities', field], this);
  }

  protected isFieldExist(field: string) {
    const section = this.getFieldSection(field);
    return !!getIn(['configSelf', section, field], this);
  }


  protected isFieldValueExist(field: string) {
    const section = this.getFieldSection(field);
    return !!selectValue([section, field], this.input, this.data);
  }

  protected getRelationship(field: string) {
    if (!this.isFieldExist(field)) {
      console.error('[entity]', 'Field is missing in entity', {field, entity_type: this.type});
    }
    if (field === 'roles') {
      // debugger;
    }
    if (!this.isFieldValueExist(field)) {
      return null;
    }
    const value = selectValue(['relationships', field], this.input, this.data);

    if (!value.data) {
      return null;
    }


    return Array.isArray(value.data) ? value.data.map((data) => this.getEntity(field, data)) : this.getEntity(field, value.data);
  }
}
