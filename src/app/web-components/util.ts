import {IEntityComment} from './comment/types';

export function getParentId(comment: IEntityComment) {
  return comment.pid ? comment.pid.id : comment.entity_id.id;
}
