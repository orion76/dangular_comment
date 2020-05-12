import {IEntity, IEntityConfig} from '../types';
import {ETypes} from '../../../../../../web-components/configs/entities/types';
import {IJsonApiEntity, IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';

export interface IEntityTest extends IEntity {
  label: string;
  content: string;
  author: IEntity;
}


export const config: IEntityConfig = {
  type: ETypes.NODE_ARTICLE,
  attributes: {
    label: {type: 'string', label: 'label'},
    content: {type: 'string', label: 'label'},
  },
  relationships: {
    author: {label: 'user', type: ETypes.USER},
  }
};


export const data: IJsonApiEntity = {
  id: 'id',
  type: ETypes.NODE_ARTICLE,
  attributes: {
    label: 'label',
    content: 'content'
  },
  relationships: {
    author: {
      data: {type: ETypes.USER, id: '111'}
    }
  }
};

export const response: IJsonApiEntityDoc = {
  data: [data],
  included: []
};
