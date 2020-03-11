import {Action} from '@ngrx/store';
import {IEntityUser} from '../../services/user/types';

export namespace LoggedUsersAction {

  export enum EActions {
    SET = '[USER] SET',
  }


  export class Set implements Action {
    readonly type = EActions.SET;

    constructor(public user: IEntityUser) {
    }
  }

  export type TActions = Set;

}
