import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';
import {IEntity, IEntityAttributeConfig, IEntityBase, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {IDataTypeLike, IFormattedBody} from '../../../comment/types';
import {Entity} from '@dangular-common/entity/entity';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';


export const configRequest: IRequestConfig = {
  type: ETypes.COMMENT,
  sources: {
    default: {
      url: 'jsonapi/comment/comment',
      types: {
        one: {include: ['uid']},
        list: {include: ['uid']},
        add: {include: ['uid']},
        update: {include: ['uid']},
        delete: {}
      }
    }
  }
};

export interface IEntityConfigComment extends IEntityConfig {
  attributes: {
    entity_type: IEntityAttributeConfig,
    field_name: IEntityAttributeConfig,
    subject: IEntityAttributeConfig,
    body: IEntityAttributeConfig,
    child_count: IEntityAttributeConfig,
    is_root: IEntityAttributeConfig,
    created: IEntityAttributeConfig,
    changed: IEntityAttributeConfig
  };
  relationships: {
    entity_id: IEntityRelationshipConfig,
    uid: IEntityRelationshipConfig,
    pid: IEntityRelationshipConfig
  }
}

export const configEntity: IEntityConfigComment = {
  type: ETypes.COMMENT,
  attributes: {
    body: {type: 'string', label: 'Content'},
    entity_type: {type: 'string', label: 'Entity Type'},
    field_name: {type: 'string', label: 'Field name'},
    subject: {type: 'string', label: 'Subject'},
    child_count: {type: 'integer', label: 'Children count'},
    is_root: {type: 'boolean', label: 'is root'},
    created: {type: 'datetime', label: 'Created'},
    changed: {type: 'datetime', label: 'Changed'},
  },
  relationships: {
    entity_id: {type: ETypes.NODE_DISCUSSION, label: 'Entity ID'},
    uid: {type: ETypes.USER, label: 'author', included: true},
    pid: {type: ETypes.COMMENT, label: 'parent'},
  },
};

export class EntityComment extends Entity implements IEntityComment {
  constructor(jsonapi?: IJsonApiEntity) {
    super(jsonapi);
  }

  get config() {
    return configEntity;
  }
}

export interface IEntityComment extends IEntity {
  entity_type?: string;
  entity_id?: IEntityBase;
  field_name?: string;
  pid?: IEntityBase;
  uid?: IEntityBase;
  subject?: string;
  body?: IFormattedBody;

  child_count?: number;
  is_root?: boolean;
  created?: string;
  changed?: string;
  like?: IDataTypeLike;
}
