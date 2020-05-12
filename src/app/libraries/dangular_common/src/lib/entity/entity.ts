import {IEntity, IEntityConfig} from './types';
import {cloneObject, getIn, selectValue, setIn} from '@dangular-common/entity/utils';
import {IJsonApiAttributes, IJsonApiEntity, IJsonApiRelationshipData, IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {mergeAttributes, mergeRelationships} from '@dangular-common/entity/entity-to-jsonapi';


export abstract class Entity implements IEntity {
  abstract config: IEntityConfig;
  protected input: Partial<IJsonApiEntity>;

  constructor(protected jsonapi?: IJsonApiEntity) {
    this.createModelProperties();
  }

  get label(): string {
    return selectValue(['label'], this.input, this.jsonapi);
  };

  get id(): string {
    return selectValue(['id'], this.input, this.jsonapi);
  };

  set id(id: string) {
    setIn(this, ['input', 'id'], id);
  };

  get type(): string {
    return this.config.type;
  };

  isChanged(): boolean {
    return !!this.input;
  }

  setJsonApi<T extends IEntity>(data: IJsonApiEntity) {
    this.jsonapi = {...data};
    return this;
  }

  setValues<T extends IEntity>(values: Partial<T>) {
    Object.keys(values).forEach((key: string) => this[key] = values[key]);
  }

  getJsonApiEntity(): IJsonApiEntity {
    const {id, type} = this;


    const data_attributes: IJsonApiAttributes = (this.jsonapi && this.jsonapi.attributes) ? this.jsonapi.attributes : {};
    const data_relationships: Record<string, IJsonApiRelationshipData> = (this.jsonapi && this.jsonapi.relationships) ? this.jsonapi.relationships : {};

    const input_relationships: Record<string, IJsonApiRelationshipData> = (this.input && this.input.relationships) ? this.input.relationships : {};
    const input_attributes: IJsonApiAttributes = (this.input && this.input.attributes) ? this.input.attributes : {};

    const data: IJsonApiEntity = {
      id, type,
      attributes: mergeAttributes(input_attributes, data_attributes),
      relationships: mergeRelationships(input_relationships, data_relationships),
    };

    return cloneObject(data);
  }

  getJsonApiDoc(): IJsonApiEntityDoc {
    const data = this.getJsonApiEntity();
    return {data};
  }

  /**
   * @TODO
   */
  getJsonApiIncluded(): IJsonApiEntity[] {
    return [];
  }

  protected set(field: string, value: any) {
    const section = this.getFieldSection(field);

    switch (section) {
      case 'attributes':
        setIn(this, ['input', 'attributes', field], value);
        break;
      case 'relationships':
        const {id, type} = value;
        setIn(this, ['input', 'relationships', field, 'data'], {id, type});
        break;
    }
  }

  protected get(field: string) {
    const section = this.getFieldSection(field);
    switch (section) {
      case 'attributes':
        return selectValue([section, field], this.input, this.jsonapi);
        break;

      case 'relationships':
        return selectValue([section, field, 'data'], this.input, this.jsonapi);
        break;
    }

  }

  protected getFieldSection(field: string): string {
    if (getIn(['config', 'attributes', field], this)) {
      return 'attributes';
    }

    if (getIn(['config', 'relationships', field], this)) {
      return 'relationships';
    }
  }

  protected createModelProperties() {
    ['attributes', 'relationships']
      .filter((section) => Boolean(this.config[section]))
      .forEach((section: string) => {
        Object.keys(this.config[section]).forEach((field_name: string) => {
          Object.defineProperty(this, field_name, {
            get: () => this.get(field_name),
            set: (value) => this.set(field_name, value)
          });
        });
      });
  }


}
