import {EConditionOperator, JsonApiRequest} from '@dangular-data/request/jsonapi-request';

import {ETypes} from '../../../../web-components/configs/entities/types';
import {IFilter, IFilters} from '@dangular-data/request/request.service';
import {IRequestConfig} from '@dangular-data/request/types';

export const configRequest: IRequestConfig = {
  type: ETypes.USER,
  sources: {
    default: {
      url: 'jsonapi/user--user',
      types: {
        one: {},
        list: {
          include: [ 'roles'],
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
        one: {include: []},
        list: {include: []},
        add: {},
        update: {},
        delete: {}
      }
    }
  }
};


describe('Request Include: Getter options.params должен возвращать объект со своством "include", содержащее строку списка полей, через запятую', () => {

  it('include в конфиге', () => {

    const request = new JsonApiRequest('list', configRequest);
    const config = configRequest.sources.default;
    const options = request.options;
    const include = config.types.list.include;

    const key = 'include';
    const value = include.join(',');
    expect(options.params[key]).toEqual(value);
  });


  it('include в запросе', () => {

    const query = {include: ['query']};
    const request = new JsonApiRequest('one', configRequest, query);
    const config = configRequest.sources.default;
    const options = request.options;
    const include = query.include;

    const key = 'include';
    const value = include.join(',');
    expect(options.params[key]).toEqual(value);
  });


  it('include в конфиге и запросе', () => {

    const query = {include: ['query']};
    const request = new JsonApiRequest('list', configRequest, query);
    const config = configRequest.sources.default;
    const options = request.options;
    const include = [...config.types.list.include, ...query.include];

    const key = 'include';
    const value = include.join(',');
    expect(options.params[key]).toEqual(value);
  });

});

