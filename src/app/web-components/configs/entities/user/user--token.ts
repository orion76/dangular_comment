import {IEntityConfigUserToken} from '../../../services/user/types';
import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';


export const configRequest: IRequestConfig = {
  type: ETypes.USER_TOKEN,
  sources: {
    default: {
      url: 'jsonapi/token',
      types: {
        one: {},
        list: {},
        add: {},
        update: {},
        delete: {}
      }
    },
  }
};

export const configEntity: IEntityConfigUserToken = {
  type: ETypes.USER_TOKEN,
  attributes: {
    'token': {label: '', type: 'string'},
  },
  relationships: {
  }
};
