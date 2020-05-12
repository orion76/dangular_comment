import {Action} from '@ngrx/store';

import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';

export namespace DataAction {

  export enum EActions {
    ADD_ONE = '[ENTITIES] ADD_ONE',
    ADD_MANY = '[ENTITIES] ADD_MANY',
  }

  export class AddOne implements Action {
    readonly type = EActions.ADD_ONE;

    constructor(public entity: IJsonApiEntity) {
    }
  }


  export class AddMany implements Action {
    readonly type = EActions.ADD_MANY;

    constructor(public entity_type: string, public entities: IJsonApiEntity[]) {
    }
  }




  export type TActions =
    | AddOne
    | AddMany;

}
