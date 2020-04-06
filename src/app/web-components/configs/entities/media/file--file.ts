import {IEntity, IEntityAttributeConfig, IEntityConfig} from '@dangular-common/entity/types';
import {ETypes} from '../types';
import {IRequestConfig} from '@dangular-data/request/types';

export interface IEntityFile extends IEntity {
  filename: string,
  uri: { value: string, url: string }
}


export interface IEntityConfigFile extends IEntityConfig {
  attributes: {
    filename: IEntityAttributeConfig,
    uri: IEntityAttributeConfig,
  };

}


export const configRequest: IRequestConfig = {
  type: ETypes.FILE,
  sources: {
    default: {
      url: 'jsonapi/file/file',
      types: {
        one: {},
        list: {},
        add: {},
        update: {},
        delete: {}
      }
    }
  }

};

export const configEntity: IEntityConfigFile = {
  type: ETypes.FILE,
  attributes: {
    filename: {type: 'string', label: 'Name'},
    uri: {type: 'object', label: 'Uri'},
  },
};
