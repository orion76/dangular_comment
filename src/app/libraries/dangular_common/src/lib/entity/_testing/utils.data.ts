import {ETypes} from '../../../../../../web-components/configs/entities/types';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';

export const inputUser: Partial<IJsonApiEntity> = {
  'attributes': {
    'display_name': 'admin-updated',
    'langcode': 'ru-updated',
    'mail': 'gpb@yandex.ru-updated',
  },
  relationships: {
    'common_profiles': {
      'data': {
        'type': ETypes.USER_PROFILE_COMMON,
        'id': 'f8a80abc-6af8-427c-bd3e-b9d822a8d8b7-updated'
      },
    },
  }
};



export const dataUser: IJsonApiEntity = {
  type: ETypes.USER,
  id: '9fd903ae-f6df-4f49-89d1-e07786434ff1',
  'attributes': {
    'display_name': 'admin',
    'langcode': 'ru',
    'mail': 'gpb@yandex.ru',
    'timezone': 'Europe/Moscow',
    'status': true,
    'created': '2020-02-12T11:13:44+00:00',
    'changed': '2020-02-24T08:45:29+00:00',
    'access': '2020-03-08T04:37:54+00:00',
    'login': '2020-03-08T04:39:20+00:00',
    'label': 'admin'
  },
  'relationships': {
    'roles': {
      'data': [
        {
          'type': ETypes.USER_ROLE,
          'id': '3029058b-31fc-450f-8cbf-986df30d5a7c'
        },
        {
          'type': ETypes.USER_ROLE,
          'id': 'b5569666-1442-48e2-850d-8ed045e79348'
        }
      ],
    },
    'common_profiles': {
      'data': {
        'type': ETypes.USER_PROFILE_COMMON,
        'id': 'f8a80abc-6af8-427c-bd3e-b9d822a8d8b7'
      },
    },
  }
};

export const jsonApiResponse = {
  'jsonapi': {
    'version': '1.0',
    'meta': {
      'links': {
        'self': {
          'href': 'http://jsonapi.org/format/1.0/'
        }
      }
    }
  },
  'data': [
    {
      'type': 'user--user',
      'id': '9fd903ae-f6df-4f49-89d1-e07786434ff1',
      'links': {
        'self': {
          'href': 'http://sdd.ti-work.ru/jsonapi/user/user/9fd903ae-f6df-4f49-89d1-e07786434ff1'
        }
      },
      'attributes': {
        'display_name': 'admin',
        'drupal_internal__uid': 1,
        'langcode': 'ru',
        'preferred_langcode': 'ru',
        'preferred_admin_langcode': null,
        'mail': 'gpb@yandex.ru',
        'timezone': 'Europe/Moscow',
        'status': true,
        'created': '2020-02-12T11:13:44+00:00',
        'changed': '2020-02-24T08:45:29+00:00',
        'access': '2020-03-08T04:37:54+00:00',
        'login': '2020-03-08T04:39:20+00:00',
        'init': 'gpb@yandex.ru',
        'default_langcode': true,
        'path': {
          'alias': null,
          'pid': null,
          'langcode': 'ru'
        },
        'message_subscribe_email': false,
        'label': 'admin'
      },
      'relationships': {
        'roles': {
          'data': [
            {
              'type': 'user_role--user_role',
              'id': '3029058b-31fc-450f-8cbf-986df30d5a7c'
            },
            {
              'type': 'user_role--user_role',
              'id': 'b5569666-1442-48e2-850d-8ed045e79348'
            }
          ],
          'links': {
            'related': {
              'href': 'http://sdd.ti-work.ru/jsonapi/user/user/9fd903ae-f6df-4f49-89d1-e07786434ff1/roles'
            },
            'self': {
              'href': 'http://sdd.ti-work.ru/jsonapi/user/user/9fd903ae-f6df-4f49-89d1-e07786434ff1/relationships/roles'
            }
          }
        },
        'common_profiles': {
          'data': {
            'type': 'profile--common',
            'id': 'f8a80abc-6af8-427c-bd3e-b9d822a8d8b7'
          },
          'links': {
            'related': {
              'href': 'http://sdd.ti-work.ru/jsonapi/user/user/9fd903ae-f6df-4f49-89d1-e07786434ff1/common_profiles'
            },
            'self': {
              'href': 'http://sdd.ti-work.ru/jsonapi/user/user/9fd903ae-f6df-4f49-89d1-e07786434ff1/relationships/common_profiles'
            }
          }
        },

      }
    }
  ],
  'links': {
    'self': {
      'href': 'http://sdd.ti-work.ru/jsonapi/me'
    }
  }
};
