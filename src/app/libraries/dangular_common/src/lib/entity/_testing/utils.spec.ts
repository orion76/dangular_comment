import {getIn, mergeInputAndResponse, setIn} from '@dangular-common/entity/utils';
import {dataUser, inputUser} from '@dangular-common/entity/_testing/utils.data';
import {configEntity as configEntityUser} from '../../../../../../web-components/configs/entities/user/user--user';

describe('Entity Utils', () => {
  it('setIn устанавливает значение своства вложенного в иерархию объекта по пути(массив наименований полей)', () => {
    const obj: any = {};
    setIn(obj, ['one', 'two', 'three'], 'value');
    expect(obj.one.two.three).toEqual('value');
  });

  it('getIn возвращает значение своства вложенного в иерархию объекта по пути(массив наименований полей)', () => {
    const obj: any = {};
    const path = ['one', 'two', 'three'];
    setIn(obj, path, 'value');
    expect(getIn(path, obj)).toEqual('value');
  });


  it('mergeInputAndResponse - объединяет секции input(установленные свойства объекта Entity) и data(полученные из БД)', () => {
    const result = mergeInputAndResponse(configEntityUser, inputUser, dataUser);

    ['display_name', 'langcode', 'mail'].forEach((field) => {
      const path = ['attributes', field];
      const value = getIn(path, result);
      const expected = getIn(path, inputUser);
      expect(value).toEqual(expected);
    });

    ['label', 'login', 'timezone'].forEach((field) => {
      const path = ['attributes', field];
      const value = getIn(path, result);
      const expected = getIn(path, dataUser);
      expect(value).toEqual(expected);
    });

    ['common_profiles'].forEach((field) => {
      const path = ['relationships', field, 'data', 'id'];
      const value = getIn(path, result);
      const expected = getIn(path, inputUser);
      expect(value).toEqual(expected);
    });

  });

  //
});
