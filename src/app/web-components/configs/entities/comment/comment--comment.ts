import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';
import {IEntity, IEntityAttributeConfig, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {IEntityUser} from '../../../services/user/types';
import {IDataTypeLike, IFormattedBody} from '../../../comment/types';


export const configRequest: IRequestConfig = {
  type: ETypes.COMMENT,
  sources: {
    default: {
      url: 'jsonapi/comment/comment',
      types: {
        one: {include: ['uid', 'uid.user_picture']},
        list: {include: ['uid', 'uid.user_picture']},
        add: {include: ['uid', 'uid.user_picture']},
        update: {include: ['uid', 'uid.user_picture']},
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

export interface IEntityComment extends IEntity {
  entity_type: string;
  entity_id: IEntity;
  field_name: string;
  pid?: IEntityComment;
  uid: IEntityUser;
  subject: string;
  body: IFormattedBody;

  child_count: number;
  is_root: boolean;
  created: string;
  changed: string;
  like: IDataTypeLike;
}
