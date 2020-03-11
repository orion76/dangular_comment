import {EConditionOperator, JsonApiRequest} from '@dangular-data/request/jsonapi-request';

import {ICondition} from '@dangular-data/request/request.service';
import {configRequest} from '@dangular-data/request/_testing/data';
import {setIn} from '@dangular-common/entity/utils';
import {createConditionNames} from '@dangular-data/request/request-util';
import {IRequestPointConfig} from '@dangular-data/request/types';

const config: IRequestPointConfig = {
  filter: {
    conditions: [{path: 'path_config', value: 'value_config', operator: EConditionOperator.EQUAL}]
  }
};

const query: IRequestPointConfig = {
  filter: {
    conditions: [{path: 'path_query', value: 'value_query', operator: EConditionOperator.EQUAL}]
  }
};


describe('Request Conditions: в объекте options.params должены содержаться свойства. Имя своства - наименование фильтра, значение  - значение фильтра', () => {

  it('conditions в конфиге', () => {

    setIn(configRequest, ['sources', 'default', 'types', 'one'], config);

    const request = new JsonApiRequest('one', configRequest);
    const params = request.options.params;

    const conditions: ICondition[] = config.filter.conditions;

    conditions.forEach((cond: ICondition) => {
      createConditionNames(cond.path).forEach(({key, name}) => {
        expect(params[name]).toEqual(cond[key]);
      });
    });
  });


  it('conditions в запросе', () => {

    const request = new JsonApiRequest('one', configRequest, query);
    const params = request.options.params;

    const conditions: ICondition[] = config.filter.conditions;

    conditions.forEach((cond: ICondition) => {
      createConditionNames(cond.path).forEach(({key, name}) => {
        expect(params[name]).toEqual(cond[key]);
      });
    });
  });


  it('conditions в конфиге и запросе', () => {
    setIn(configRequest, ['sources', 'default', 'types', 'one'], config);
    const request = new JsonApiRequest('one', configRequest, query);
    const params = request.options.params;

    const source = configRequest.sources.default;


    const conditions: ICondition[] = [...source.types.one.filter.conditions, ...query.filter.conditions];

    conditions.forEach((cond: ICondition) => {
      createConditionNames(cond.path).forEach(({key, name}) => {
        expect(params[name]).toEqual(cond[key]);
      });
    });
  });

});


