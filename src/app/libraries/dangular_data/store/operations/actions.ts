import {Action} from '@ngrx/store';

import {IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {IQueryParams} from '@dangular-data/request/types';

export namespace OperationAction {

  export enum EActions {

    UPDATE_ENTITIES = '[OPERATIONS] UPDATE_ENTITIES',
    LOAD_ONE = '[OPERATIONS] LOAD_ONE',
    LOAD_ONE_SUCCESS = '[OPERATIONS] LOAD_ONE_SUCCESS',
    LOAD_ONE_ERROR = '[OPERATIONS] LOAD_ONE_ERROR',
    LOAD_MANY = '[OPERATIONS] LOAD_MANY',
    LOAD_MANY_SUCCESS = '[OPERATIONS] LOAD_MANY_SUCCESS',
    LOAD_MANY_ERROR = '[OPERATIONS] LOAD_MANY_ERROR',
    SAVE_NEW = '[OPERATIONS] SAVE_NEW',
    SAVE_NEW_SUCCESS = '[OPERATIONS] SAVE_NEW_SUCCESS',
    SAVE_NEW_ERROR = '[OPERATIONS] SAVE_NEW_ERROR',
    SAVE_UPDATE = '[OPERATIONS] SAVE_UPDATE',
    SAVE_UPDATE_SUCCESS = '[OPERATIONS] SAVE_UPDATE_SUCCESS',
    SAVE_UPDATE_ERROR = '[OPERATIONS] SAVE_UPDATE_ERROR',
    SAVE_DELETE = '[OPERATIONS] SAVE_DELETE',
    OPERATION_COMPLETE = '[OPERATIONS] OPERATION_COMPLETE',
  }

  export class OperationComplete implements Action {
    readonly type = EActions.OPERATION_COMPLETE;

    constructor(public operation_id: string) {
    }
  }


  export class LoadOne implements Action {
    readonly type = EActions.LOAD_ONE;

    constructor(public operation_id: string, public entity_type: string, public params?: IQueryParams) {
    }
  }

  export class LoadOneSuccess implements Action {
    readonly type = EActions.LOAD_ONE_SUCCESS;

    constructor(public operation_id: string,
                public entity_type: string,
                public entity_id: string,
                public response: IJsonApiEntityDoc) {
    }
  }


  export class LoadOneError implements Action {
    readonly type = EActions.LOAD_ONE_ERROR;

    constructor(public operation_id: string, public entity_type: string, public params?: IQueryParams) {
    }
  }


  export class SaveNew implements Action {
    readonly type = EActions.SAVE_NEW;

    constructor(public operation_id: string, public entity_type: string, public jsonapi: IJsonApiEntityDoc) {
    }
  }

  export class SaveNewSuccess implements Action {
    readonly type = EActions.SAVE_NEW_SUCCESS;

    constructor(public operation_id: string, public entity_type: string, public entity_id: string, public response: IJsonApiEntityDoc) {
    }
  }

  export class SaveNewError implements Action {
    readonly type = EActions.SAVE_NEW_ERROR;

    constructor(public error: any) {
    }
  }

  export class SaveUpdate implements Action {
    readonly type = EActions.SAVE_UPDATE;

    constructor(public operation_id: string, public entity_type: string, public response: IJsonApiEntityDoc) {
    }
  }

  export class SaveUpdateSuccess implements Action {
    readonly type = EActions.SAVE_UPDATE_SUCCESS;

    constructor(public operation_id: string, public entity_type: string, public  entity_id: string, public response: IJsonApiEntityDoc) {
    }
  }

  export class SaveUpdateError implements Action {
    readonly type = EActions.SAVE_UPDATE_ERROR;

    constructor(public error: any) {
    }
  }


  export class LoadMany implements Action {
    readonly type = EActions.LOAD_MANY;

    constructor(public operation_id: string, public entity_type: string, public params?: IQueryParams) {
    }
  }

  export class LoadManySuccess implements Action {
    readonly type = EActions.LOAD_MANY_SUCCESS;

    constructor(public operation_id: string, public entity_type: string, public entity_ids: string[], public response: IJsonApiEntityDoc) {
    }
  }

  export class LoadManyError implements Action {
    readonly type = EActions.LOAD_MANY_ERROR;

    constructor(public operation_id: string, public entity_type: string) {
    }
  }

  export class UpdateEntities implements Action {
    readonly type = EActions.UPDATE_ENTITIES;

    constructor(public operation_id: string, public entity_type: string, public jsonapi: IJsonApiEntityDoc) {
    }
  }


  export type TActions =
    | SaveNew
    | SaveNewSuccess
    | SaveNewError
    | SaveUpdate
    | SaveUpdateSuccess
    | SaveUpdateError
    | LoadOne
    | LoadOneSuccess
    | LoadOneError
    | LoadMany
    | LoadManySuccess
    | LoadManyError
    | UpdateEntities
    |OperationComplete;

}
