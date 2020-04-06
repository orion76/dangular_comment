import {IEntityAttributeConfig, IEntityConfig, IEntityRelationshipConfig} from '@dangular-common/entity/types';


export interface IEntityConfigVoteRes extends IEntityConfig {
  attributes: {
    entity_type: IEntityAttributeConfig,
    sum: IEntityAttributeConfig,
    count: IEntityAttributeConfig,
  };
  relationships: {
    entity_id: IEntityRelationshipConfig,
    user_vote: IEntityRelationshipConfig,
  }
}

export interface IEntityConfigVote extends IEntityConfig {
  attributes: {
    entity_type: IEntityAttributeConfig,
    value: IEntityAttributeConfig,
    timestamp: IEntityAttributeConfig,
  };
  relationships: {
    entity_id: IEntityRelationshipConfig,
    user_id: IEntityRelationshipConfig,
  }
}
