import {Action} from '@ngrx/store';
import {IEntity} from '@dangular-common/entity/types';
import {ICommentStates} from '../comment_state/reducer';
import {IEntityComment} from '../../configs/entities/comment/comment--comment';

export namespace CommentsAction {

  export enum EActions {
    ADD_ENTITY = '[ENTITIES] ADD_ENTITY',
    COMMENT_ADD = '[ENTITIES] COMMENT_ADD',
    COMMENT_UPDATE = '[ENTITIES] COMMENT_UPDATE',
    NODE_ADD_COMMENTS = '[ENTITIES] NODE_ADD_COMMENTS',
    UPDATE_COMMENTS = '[ENTITIES] UPDATE_COMMENTS',
    DELETE_COMMENTS = '[ENTITIES] DELETE_COMMENTS',
  }


  export class AddEntity implements Action {
    readonly type = EActions.ADD_ENTITY;

    constructor(public entity: IEntity) {
    }
  }

  export class CommentAdd implements Action {
    readonly type = EActions.COMMENT_ADD;

    constructor(public comment: IEntityComment) {
    }
  }

  export class CommentUpdate implements Action {
    readonly type = EActions.COMMENT_UPDATE;

    constructor(public comment: IEntityComment) {
    }
  }

  export class NodeAddComments implements Action {
    readonly type = EActions.NODE_ADD_COMMENTS;

    constructor(public nodeId: string, public comments: IEntityComment[], public state?: ICommentStates) {
      comments.forEach((comment) => {
        if (!comment.id) {
          debugger;
        }
      });
    }
  }

  export type TActions =
    AddEntity
    | NodeAddComments
    | CommentAdd
    | CommentUpdate;

}
