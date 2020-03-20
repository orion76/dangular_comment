import {IEntity, IEntityAttributeConfig, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';
import {IEntityUser} from '../services/user/types';

export interface IEntityImage extends IEntity {
  src: string;
  alt: string;
}

export  type UFormMode = 'edit' | 'create';


export interface IFormattedBody {
  value?: string;
  format?: string;
  processed?: string;
}

export interface IEntityComment extends IEntity {
  entity_type: string;
  entity_id: IEntity;
  field_name: string;
  pid?: IEntityComment;
  uid: IEntityUser;
  subject: string;
  body: IFormattedBody;

  child_count: number;
  is_root: boolean;
  created: string;
  changed: string;
}

export interface IEntityConfigComment extends IEntityConfig {
  attributes: {
    entity_type: IEntityAttributeConfig,
    field_name: IEntityAttributeConfig,
    subject: IEntityAttributeConfig,
    body: IEntityAttributeConfig,
    child_count: IEntityAttributeConfig,
    is_root: IEntityAttributeConfig,
    created: IEntityAttributeConfig,
    changed: IEntityAttributeConfig
  };
  relationships: {
    entity_id: IEntityRelationshipConfig,
    uid: IEntityRelationshipConfig,
    pid: IEntityRelationshipConfig
  }
}
