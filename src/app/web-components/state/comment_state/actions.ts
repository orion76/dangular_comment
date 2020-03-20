import {Action} from '@ngrx/store';
import {ICommentState} from './reducer';

export namespace CommentStateAction {

  export enum EActions {
    EXPAND = '[COMMENT STATE] EXPAND',
    COLLAPSE = '[COMMENT STATE] COLLAPSE',
    HIDDEN = '[COMMENT STATE] HIDDEN',
    VISIBLE = '[COMMENT STATE] VISIBLE',
    STATE_DELETE = '[COMMENT STATE] STATE_DELETE',
    CHILDREN_LOADED = '[COMMENT STATE] CHILDREN_LOADED',
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

  export class ChildrenLoaded implements Action {
    readonly type = EActions.CHILDREN_LOADED;

    constructor(public ids: string[]) {
    }
  }

  export class ChildrenNotLoaded implements Action {
    readonly type = EActions.CHILDREN_NOT_LOADED;

    constructor(public ids: string[]) {
    }
  }

  export type TActions =
    Expand
    | Collapse
    | Hidden
    | Visible
    | StateDelete
    | ChildrenLoaded
    | ChildrenNotLoaded;

}
