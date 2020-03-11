import {addCondition, addConditions, addFilter, addInclude, createConditionPrefix} from '@dangular-data/request/request-util';
import {ICondition, IFilter} from '@dangular-data/request/request.service';
import {EConditionOperator} from '@dangular-data/request/jsonapi-request';
import {IRequestPointConfig} from '@dangular-data/request/types';


describe('Request Utils', () => {

  describe('функция addInclude, добавляет к аргументу params поле include, значение - список полей через запятую', () => {
    it('список include в конфиге', () => {
      const params: Record<string, string> = {};

      const config: IRequestPointConfig = {
        include: ['include_1', 'include_2', 'include_3',]
      };
      const query: IRequestPointConfig = undefined;

      addInclude(params, config, query);

      expect(params.include).toBeTruthy();
      const expected = config.include.join(',');
      expect(params.include).toEqual(expected);
    });

    it('список include в запросе', () => {
      const params: Record<string, string> = {};

      const config: IRequestPointConfig = {};
      const query: IRequestPointConfig = {
        include: ['include_1', 'include_2', 'include_3']
      };

      addInclude(params, config, query);

      expect(params.include).toBeTruthy();
      const expected = query.include.join(',');
      expect(params.include).toEqual(expected);
    });

    it('список include в конфиге и запросе (одинаковый)', () => {
      const params: Record<string, string> = {};

      const config: IRequestPointConfig = {
        include: ['include_1', 'include_2', 'include_3']
      };

      const query: IRequestPointConfig = {
        include: ['include_1', 'include_2', 'include_3']
      };

      addInclude(params, config, query);

      expect(params.include).toBeTruthy();
      const expected = query.include.join(',');
      expect(params.include).toEqual(expected);
    });

    it('список include в конфиге и запросе (разный)', () => {
      const params: Record<string, string> = {};

      const config: IRequestPointConfig = {
        include: ['include_1', 'include_2']
      };

      const query: IRequestPointConfig = {
        include: ['include_3']
      };

      addInclude(params, config, query);

      expect(params.include).toBeTruthy();
      const expected = ['include_1', 'include_2', 'include_3'].join(',');
      expect(params.include).toEqual(expected);
    });

  });

  it('функция addFilter, добавляет к аргументу params поле, наименование поля - наименование фильтра, значение поля- значение фильтра', () => {
    const params: Record<string, string> = {};

    const filter: IFilter = {
      field: 'field.name', value: 'field.value'
    };

    addFilter(params, filter);
    const field_name = `filter[${filter.field}]`;
    expect(params[field_name]).toBeTruthy();
    expect(params[field_name]).toEqual(filter.value);
  });

  it('функция addCondition, добавляет к аргументу params поле, наименование поля - наименование фильтра, значение поля- значение фильтра', () => {
    const params: Record<string, string> = {};

    const condition: ICondition = {
      path: 'field.name', value: 'field.value', operator: EConditionOperator.EQUAL
    };

    addCondition(params, condition);


    const path_name = 'filter[field-name][condition][path]';
    const value_name = 'filter[field-name][condition][value]';
    const operator_name = 'filter[field-name][condition][operator]';

    expect(params[path_name]).toBeTruthy();
    expect(params[value_name]).toBeTruthy();
    expect(params[operator_name]).toBeTruthy();

    expect(params[path_name]).toEqual(condition.path);
    expect(params[value_name]).toEqual(condition.value);
    expect(params[operator_name]).toEqual(condition.operator);

  });

  describe('функция addConditions, добавляет к аргументу params полЯ, наименование поля - наименование фильтра, значение поля- значение фильтра', () => {

    it('conditions в конфиге', () => {
      const params: Record<string, string> = {};

      const condition: ICondition = {path: 'field_1', value: 'value_1', operator: EConditionOperator.EQUAL};

      const config: IRequestPointConfig = {
        filter: {
          conditions: [
            condition
          ]
        }
      };
      const query: IRequestPointConfig = null;

      addConditions(params, config, query);
      const prefix = createConditionPrefix(condition.path);

      const path_name = 'filter[field-1][condition][path]';
      const value_name = 'filter[field-1][condition][value]';
      const operator_name = 'filter[field-1][condition][operator]';

      expect(params[path_name]).toBeTruthy();
      expect(params[value_name]).toBeTruthy();
      expect(params[operator_name]).toBeTruthy();

      expect(params[path_name]).toEqual(condition.path);
      expect(params[value_name]).toEqual(condition.value);
      expect(params[operator_name]).toEqual(condition.operator);

    });

    it('conditions в запросе', () => {
      const params: Record<string, string> = {};

      const condition: ICondition = {path: 'field_1', value: 'value_1', operator: EConditionOperator.EQUAL};

      const config: IRequestPointConfig = {};
      const query: IRequestPointConfig = {
        filter: {
          conditions: [
            condition
          ]
        }
      };

      addConditions(params, config, query);


      const path_name = 'filter[field-1][condition][path]';
      const value_name = 'filter[field-1][condition][value]';
      const operator_name = 'filter[field-1][condition][operator]';

      expect(params[path_name]).toBeTruthy();
      expect(params[value_name]).toBeTruthy();
      expect(params[operator_name]).toBeTruthy();

      expect(params[path_name]).toEqual(condition.path);
      expect(params[value_name]).toEqual(condition.value);
      expect(params[operator_name]).toEqual(condition.operator);

    });

    it('conditions в конфиге и запросе', () => {
      const params: Record<string, string> = {};

      const conditionConfig: ICondition = {path: 'field_1', value: 'value_1', operator: EConditionOperator.EQUAL};
      const conditionQuery: ICondition = {path: 'field_2', value: 'value_2', operator: EConditionOperator.MORE};

      const config: IRequestPointConfig = {
        filter: {conditions: [conditionConfig]}
      };


      const query: IRequestPointConfig = {
        filter: {conditions: [conditionQuery]}
      };


      addConditions(params, config, query);


      const config_path_name = 'filter[field-1][condition][path]';
      const config_value_name = 'filter[field-1][condition][value]';
      const config_operator_name = 'filter[field-1][condition][operator]';

      expect(params[config_path_name]).toBeTruthy();
      expect(params[config_value_name]).toBeTruthy();
      expect(params[config_operator_name]).toBeTruthy();

      expect(params[config_path_name]).toEqual(conditionConfig.path);
      expect(params[config_value_name]).toEqual(conditionConfig.value);
      expect(params[config_operator_name]).toEqual(conditionConfig.operator);


      const query_path_name = 'filter[field-2][condition][path]';
      const query_value_name = 'filter[field-2][condition][value]';
      const query_operator_name = 'filter[field-2][condition][operator]';

      expect(params[query_path_name]).toBeTruthy();
      expect(params[query_value_name]).toBeTruthy();
      expect(params[query_operator_name]).toBeTruthy();

      expect(params[query_path_name]).toEqual(conditionQuery.path);
      expect(params[query_value_name]).toEqual(conditionQuery.value);
      expect(params[query_operator_name]).toEqual(conditionQuery.operator);


    });
  });

});
