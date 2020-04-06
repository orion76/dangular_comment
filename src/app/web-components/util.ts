import {IEntityComment} from './configs/entities/comment/comment--comment';

export function getParentId(comment: IEntityComment) {
  return comment.pid ? comment.pid.id : comment.entity_id.id;
}
