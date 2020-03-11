import {IEntityConfigComment} from '../../../comment/types';
import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';


export const configRequest: IRequestConfig = {
  type: ETypes.COMMENT,
  sources: {
    default: {
      url: 'jsonapi/comment/comment',
      types: {
        one: {include: ['uid']},
        list: {include: ['uid']},
        add: {},
        update: {},
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
    entity_id: {type: 'string', label: 'Entity ID'},
    parentId: {type: 'string', label: 'ParentId'},
    subject: {type: 'string', label: 'Subject'},
    created: {type: 'datetime', label: 'Created'},
    changed: {type: 'datetime', label: 'Changed'},
  },
  relationships: {
    uid: {type: ETypes.USER, label: 'author', included: true},
    pid: {type: ETypes.COMMENT, label: 'parent'},
  },
};
