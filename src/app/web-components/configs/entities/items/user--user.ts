import {IEntityConfigUser} from '../../../services/user/types';
import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';




export const configRequest: IRequestConfig = {
  type: ETypes.USER,
  sources: {
    default: {
      url: 'jsonapi/user/user',
      types: {
        one: {include: ['user_picture']},
        list: {include: ['user_picture']},
        add: {},
        update: {},
        delete: {}
      }
    },
    current: {
      url: 'jsonapi/me',
      types: {
        one: {include: ['user_picture']},
        list: {include: ['user_picture']},
        add: {},
        update: {},
        delete: {}
      }
    }
  }
};

export const configEntity: IEntityConfigUser = {
  type: ETypes.USER,
  attributes: {
    'display_name': {label: '', type: 'string'},
    'drupal_internal__uid': {label: '', type: 'integer'},
    'langcode': {label: '', type: 'string'},
    'mail': {label: '', type: 'string'},
    'timezone': {label: 'timezone', type: 'string'},
    'status': {label: 'status', type: 'boolean'},
    'created': {label: 'created', type: 'datetime'},
    'changed': {label: 'changed', type: 'datetime'},
    'access': {label: 'access', type: 'datetime'},
    'login': {label: 'login', type: 'datetime'},
    'label': {label: 'label', type: 'string'}
  },
  relationships: {
    roles: {label: '', type: ETypes.USER_ROLE},
    common_profiles: {label: '', type: ETypes.USER_PROFILE_COMMON},
    user_picture: {label: '', type: ETypes.FILE, included: true}
  }
};
