import {Action} from '@ngrx/store';
import {IEntityConfig} from '@dangular-common/entity/types';

export namespace ConfigEntityAction {

  export enum EActions {
    ADD = '[CONFIG ENTITY] ADD',
    ADD_MANY = '[CONFIG ENTITY] ADD_MANY',
  }


  export class Add implements Action {
    readonly type = EActions.ADD;

    constructor(public config: IEntityConfig) {
    }
  }


  export class AddMany implements Action {
    readonly type = EActions.ADD_MANY;

    constructor(public configs: IEntityConfig[]) {
    }
  }

  export type TActions = Add | AddMany;

}
