import {Action} from '@ngrx/store';
import {IEntityUser} from '../../services/user/types';
import {IEntityBase} from '@dangular-common/entity/types';


export namespace CommentGlobalAction {

  export enum EActions {
    SET_CURRENT_USER = '[COMMENT GLOBAL] SET_CURRENT_USER',
    SET_COMMENT_FIELD_NAME = '[COMMENT GLOBAL] SET_COMMENT_FIELD_NAME',
    SET_COMMENTED_ENTITY = '[COMMENT GLOBAL] SET_COMMENTED_ENTITY',
  }

  export class SetCurrentUser implements Action {
    readonly type = EActions.SET_CURRENT_USER;

    constructor(public uid: IEntityUser) {
    }
  }


  export class SetCommentFieldName implements Action {
    readonly type = EActions.SET_COMMENT_FIELD_NAME;

    constructor(public field_name: string) {
    }
  }


  export class SetCommentedEntity implements Action {
    readonly type = EActions.SET_COMMENTED_ENTITY;

    constructor(public entity: IEntityBase) {
    }
  }


  export type TActions =
    SetCurrentUser
    | SetCommentedEntity
    | SetCommentFieldName;

}
