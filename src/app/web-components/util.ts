import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';
import {getIn} from '@dangular-common/entity/utils';

export function getParentId(comment: IJsonApiEntity) {

  return getIn(['relationships', 'pid', 'data', 'id'], comment) ||
    getIn(['relationships', 'entity_id', 'data', 'id'], comment);
}
