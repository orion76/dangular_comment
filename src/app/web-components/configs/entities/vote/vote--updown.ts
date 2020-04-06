import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';
import {IEntityConfigVote} from './types';


export const configRequest: IRequestConfig = {
  type: ETypes.VOTE_RESULT_UPDOWN,
  sources: {
    default: {
      url: 'jsonapi/vote/updown',
    }
  }
};

export const configEntity: IEntityConfigVote = {
  type: ETypes.VOTE_UPDOWN,
  attributes: {
    entity_type: {type: 'string', label: 'Entity Type'},
    value: {type: 'integer', label: 'Value'},
    timestamp: {type: 'string', label: 'Timestamp'},
  },
  relationships: {
    entity_id: {type: ETypes.NODE_DISCUSSION, label: 'Entity ID'},
    user_id: {type: ETypes.USER, label: 'author', included: true},
  },
};
