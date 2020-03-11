import {IEntity, IEntityAttributeConfig, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {ETypes} from '../types';
import {IEntityUser} from '../../../services/user/types';
import {IRequestConfig} from '@dangular-data/request/types';

export interface IEntityNodeArticle extends IEntity {
  uid: IEntityUser,
  body: string
}


export interface IEntityConfigNode extends IEntityConfig {
  attributes: {
    body: IEntityAttributeConfig
  };
  relationships: {
    uid: IEntityRelationshipConfig
  }
}


export const configRequest: IRequestConfig = {
  type: ETypes.NODE_ARTICLE,
  sources: {
    default: {
      url: 'jsonapi/node/article',
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

export const configEntity: IEntityConfigNode = {
  type: ETypes.NODE_ARTICLE,
  attributes: {
    body: {type: 'string', label: 'Content'}
  },
  relationships: {
    uid: {type: ETypes.USER, label: 'author'}
  },
};
