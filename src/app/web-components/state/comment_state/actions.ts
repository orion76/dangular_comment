import {Action} from '@ngrx/store';
import {ICommentState} from './types';


export namespace CommentStateAction {

  export enum EActions {
    STATE_INIT_MANY = '[COMMENT STATE] STATE_INIT_MANY',
    STATE_DELETE = '[COMMENT STATE] STATE_DELETE',
    SET_CAN_REPLY = '[COMMENT STATE] SET_CAN_REPLY',
    SET_CHILD_COUNT = '[COMMENT STATE] SET_CHILD_COUNT',
    SET_EXPANDED = '[COMMENT STATE] SET_EXPANDED',

    SET_EDITABLE = '[COMMENT STATE] SET_EDITABLE',
  }

  export class StateInitMany implements Action {
    readonly type = EActions.STATE_INIT_MANY;

    constructor(public comments: ICommentState[]) {
    }
  }


  export class SetCanReply implements Action {
    readonly type = EActions.SET_CAN_REPLY;

    constructor(public ids: string[]) {
    }
  }

  export class SetExpanded implements Action {
    readonly type = EActions.SET_EXPANDED;

    constructor(public ids: string[], public value: boolean) {
    }
  }

  export class SetChildCount implements Action {
    readonly type = EActions.SET_CHILD_COUNT;

    constructor(public values: Partial<ICommentState>[]) {
    }
  }

  export class StateDelete implements Action {
    readonly type = EActions.STATE_DELETE;

    constructor(public ids: string[]) {
    }
  }

  export class setEditable implements Action {
    readonly type = EActions.SET_EDITABLE;

    constructor(public id: string, public editable: boolean) {
    }
  }


  export type TActions =
    StateInitMany
    | SetCanReply
    | SetExpanded
    | SetChildCount
    | StateDelete
    | setEditable;

}
