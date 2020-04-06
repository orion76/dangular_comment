import {Action} from '@ngrx/store';
import {ICommentState} from './reducer';

export namespace CommentStateAction {

  export enum EActions {
    EXPAND = '[COMMENT STATE] EXPAND',
    COLLAPSE = '[COMMENT STATE] COLLAPSE',
    HIDDEN = '[COMMENT STATE] HIDDEN',
    VISIBLE = '[COMMENT STATE] VISIBLE',
    STATE_DELETE = '[COMMENT STATE] STATE_DELETE',
    SET_EDITABLE = '[COMMENT STATE] SET_EDITABLE',
    CHILDREN_NOT_LOADED = '[COMMENT STATE] CHILDREN_NOT_LOADED',
  }

  export class Expand implements Action {
    readonly type = EActions.EXPAND;

    constructor(public id: string, public root?: boolean) {
    }
  }


  export class Collapse implements Action {
    readonly type = EActions.COLLAPSE;

    constructor(public id: string) {
    }
  }

  export class Hidden implements Action {
    readonly type = EActions.HIDDEN;

    constructor(public ids: string[]) {
    }
  }

  export class Visible implements Action {
    readonly type = EActions.VISIBLE;

    constructor(public ids: string[]) {
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
    Expand
    | Collapse
    | Hidden
    | Visible
    | StateDelete
    | setEditable;

}
