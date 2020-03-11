import {IEntity, IEntityAttributeConfig, IEntityBase, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {IEntityUser} from '../services/user/types';

export interface IEntityImage extends IEntity {
  src: string;
  alt: string;
}

export  type UFormMode='edit'|'create';


export interface IEntityComment extends IEntity {
  entity_type: string,
  entity_id: string,
  parentId: string,
  pid?: IEntityComment;
  uid: IEntityUser;
  subject: string;
  body: string;
  created: string;
  changed: string;
}

export interface IEntityConfigComment extends IEntityConfig {
  attributes: {
    entity_type:IEntityAttributeConfig,
    entity_id:IEntityAttributeConfig,
    parentId:IEntityAttributeConfig,
    subject: IEntityAttributeConfig
    body: IEntityAttributeConfig
    created: IEntityAttributeConfig
    changed: IEntityAttributeConfig
  };
  relationships: {
    uid: IEntityRelationshipConfig
    pid: IEntityRelationshipConfig
  }
}
