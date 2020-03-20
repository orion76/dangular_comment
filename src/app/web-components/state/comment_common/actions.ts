import {Action} from '@ngrx/store';
import {IEntityUser} from '../../services/user/types';
import {IEntityBase} from '@dangular-common/entity/types';

export namespace CommentCommonAction {

  export enum EActions {
    SET_USER = '[COMMENT COMMON] SET_USER',
    SET_FIELD_NAME = '[COMMENT COMMON] SET_FIELD_NAME',
    SET_ENTITY = '[COMMENT COMMON] SET_ENTITY',
  }


  export class SetUser implements Action {
    readonly type = EActions.SET_USER;

    constructor(public uid: IEntityUser) {
    }
  }


  export class SetFieldName implements Action {
    readonly type = EActions.SET_FIELD_NAME;

    constructor(public field_name: string) {
    }
  }


  export class SetEntity implements Action {
    readonly type = EActions.SET_ENTITY;

    constructor(public entity: IEntityBase) {
    }
  }

  export type TActions = SetUser | SetFieldName | SetEntity;

}
