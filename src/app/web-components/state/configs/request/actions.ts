import {Action} from '@ngrx/store';
import {IRequestConfig} from '@dangular-data/request/types';

export namespace ConfigRequestAction {

  export enum EActions {
    ADD = '[CONFIG REQUEST] ADD',
    ADD_MANY = '[CONFIG REQUEST] ADD_MANY',
  }


  export class Add implements Action {
    readonly type = EActions.ADD;

    constructor(public config: IRequestConfig) {
    }
  }

  export class AddMany implements Action {
    readonly type = EActions.ADD_MANY;

    constructor(public configs: IRequestConfig[]) {
    }
  }

  export type TActions = Add|AddMany;

}
