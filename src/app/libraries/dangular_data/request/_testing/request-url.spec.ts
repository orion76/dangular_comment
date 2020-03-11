import {EConditionOperator, JsonApiRequest} from '@dangular-data/request/jsonapi-request';

import {ETypes} from '../../../../web-components/configs/entities/types';
import {IRequestConfig} from '@dangular-data/request/types';

export const configRequest: IRequestConfig = {
  type: ETypes.USER,
  sources: {
    default: {
      url: 'jsonapi/user--user',
      types: {
        one: {},
        list: {
          include: ['user_picture', 'roles'],
          filter: {
            filters: [{field: 'config_field', value: 'config_value'}],
            conditions: [{path: 'path_config', value: 'value_config', operator: EConditionOperator.EQUAL}]
          }

        },
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


describe('Request Url', () => {

  it('тип  "one", запрос сущности по ID, возвращает entry point url с параметром ID', () => {
    const id = '11111';
    const request = new JsonApiRequest('one', configRequest, {id});
    const config = configRequest.sources.default;
    const expected = config.url + '/' + id;
    expect(request.url).toEqual(expected);
  });


  it('тип  "list", запрос коллекции сущностей, возвращает entry point url', () => {
    const request = new JsonApiRequest('list', configRequest);
    const config = configRequest.sources.default;
    expect(request.url).toEqual(config.url);
  });

  it('тип  "add", сохранение новой сущности, возвращает entry point url', () => {
    const request = new JsonApiRequest('add', configRequest);
    const config = configRequest.sources.default;
    expect(request.url).toEqual(config.url);
  });


  it('тип  "update", обновление сущности, возвращает entry point url', () => {
    const request = new JsonApiRequest('update', configRequest);
    const config = configRequest.sources.default;
    expect(request.url).toEqual(config.url);
  });

});


