import {JsonApiRequest} from '@dangular-data/request/jsonapi-request';

import {IFilter} from '@dangular-data/request/request.service';
import {configRequest} from '@dangular-data/request/_testing/data';
import {setIn} from '@dangular-common/entity/utils';
import {IRequestPointConfig} from '@dangular-data/request/types';

const config: IRequestPointConfig = {
  filter: {
    filters: [{field: 'config_field', value: 'config_value'}],
    // conditions: [{path: 'path_config', value: 'value_config', operator: EConditionOperator.EQUAL}]
  }
};

const query: IRequestPointConfig = {
  filter: {
    filters: [{field: 'query_field', value: 'query_value'}],
  }
};


describe('Request Filters: в объекте options.params должены содержаться свойства. Имя своства - наименование фильтра, значение  - значение фильтра', () => {

  it('filters в конфиге', () => {

    setIn(configRequest, ['sources', 'default', 'types', 'one'], config);

    const request = new JsonApiRequest('one', configRequest);
    const params = request.options.params;

    const filters: IFilter[] = config.filter.filters;

    filters.forEach((filter: IFilter) => {
      const key = `filter[${filter.field}]`;
      expect(params[key]).toEqual(filter.value);
    });
  });


  it('filters в запросе', () => {

    const request = new JsonApiRequest('one', configRequest, query);
    const params = request.options.params;

    const filters: IFilter[] = query.filter.filters;
    filters.forEach((filter: IFilter) => {
      const key = `filter[${filter.field}]`;
      expect(params[key]).toEqual(filter.value);
    });
  });


  it('filters в конфиге и запросе', () => {
    setIn(configRequest, ['sources', 'default', 'types', 'one'], config);
    const request = new JsonApiRequest('one', configRequest, query);
    const params = request.options.params;

    const source = configRequest.sources.default;

    const filters: IFilter[] = [...source.types.one.filter.filters, ...query.filter.filters];

    filters.forEach((filter: IFilter) => {
      const key = `filter[${filter.field}]`;
      expect(params[key]).toEqual(filter.value);
    });
  });

});


