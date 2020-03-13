import {IEntity, IEntityAttributeConfig, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {ETypes} from '../types';
import {IEntityUser} from '../../../services/user/types';
import {IRequestConfig} from '@dangular-data/request/types';

export interface IEntityNodeDiscussion extends IEntity {
  uid: IEntityUser,
  body: string
}


export interface IEntityConfigNodeDiscussion extends IEntityConfig {
  attributes: {
    body: IEntityAttributeConfig
  };
  relationships: {
    uid: IEntityRelationshipConfig
  }
}


export const configRequest: IRequestConfig = {
  type: ETypes.NODE_DISCUSSION,
  sources: {
    default: {
      url: 'jsonapi/node/discussion',
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

export const configEntity: IEntityConfigNodeDiscussion = {
  type: ETypes.NODE_DISCUSSION,
  attributes: {
    body: {type: 'string', label: 'Content'}
  },
  relationships: {
    uid: {type: ETypes.USER, label: 'author'}
  },
};
