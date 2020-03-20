import {IEntityConfigComment} from '../../../comment/types';
import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';


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
