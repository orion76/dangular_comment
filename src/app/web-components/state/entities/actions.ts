import {Action} from '@ngrx/store';
import {IEntityComment} from '../../comment/types';
import {IEntity} from '@dangular-common/entity/types';

export namespace EntitiesAction {

  export enum EActions {
    ADD_ENTITY = '[ENTITIES] ADD_ENTITY',
    ADD_COMMENTS = '[ENTITIES] ADD_COMMENTS',
    UPDATE_COMMENTS = '[ENTITIES] UPDATE_COMMENTS',
    DELETE_COMMENTS = '[ENTITIES] DELETE_COMMENTS',
  }


  export class AddEntity implements Action {
    readonly type = EActions.ADD_ENTITY;

    constructor(public entity: IEntity) {
    }
  }

  export class AddComments implements Action {
    readonly type = EActions.ADD_COMMENTS;

    constructor(public comments: IEntityComment[]) {
    }
  }

  export class updateComments implements Action {
    readonly type = EActions.UPDATE_COMMENTS;

    constructor(public comments: IEntityComment[]) {
    }
  }

  export class DeleteComments implements Action {
    readonly type = EActions.DELETE_COMMENTS;

    constructor(public ids: string[]) {
    }
  }


  export type TActions =
    AddEntity
    | AddComments
    | updateComments
    | DeleteComments;

}
