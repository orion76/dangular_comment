import {ETypes} from '../../../../web-components/configs/entities/types';
import {IRequestConfig} from '@dangular-data/request/types';

export const configRequest: IRequestConfig = {
  type: ETypes.USER,
  sources: {
    default: {
      url: 'jsonapi/user--user',
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
