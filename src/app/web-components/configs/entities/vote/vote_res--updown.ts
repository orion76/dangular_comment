import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';
import {IEntityConfigVoteRes} from './types';


export const configRequest: IRequestConfig = {
  type: ETypes.VOTE_RESULT_UPDOWN,
  sources: {
    default: {
      url: 'jsonapi/vote_res/updown',
      types: {
        list: {include: ['user_vote']}
      }
    },
  }
};

export const configEntity: IEntityConfigVoteRes = {
  type: ETypes.VOTE_UPDOWN,
  attributes: {
    entity_type: {type: 'string', label: 'Entity Type'},
    count: {type: 'integer', label: 'Votes count'},
    sum: {type: 'integer', label: 'Vote summ'},
  },
  relationships: {
    entity_id: {type: ETypes.NODE_DISCUSSION, label: 'Entity ID'},
    user_vote: {type: ETypes.VOTE_UPDOWN, label: 'Current user vote', included: true},
  },
};
