import {Action} from '@ngrx/store';
import {ICommentNode} from './reducer';

export namespace CommentTreeAction {

  export enum EActions {
    ADD_NODES = '[COMMENT TREE] ADD_NODE',
    UPDATE_NODES = '[COMMENT TREE] UPDATE_NODES',
    DELETE_NODES = '[COMMENT TREE] DELETE_NODE',
    ADD_CHILDREN = '[COMMENT TREE] ADD_CHILDREN',
    DELETE_CHILDREN = '[COMMENT TREE] DELETE_CHILDREN',

  }

  export class AddNodes implements Action {
    readonly type = EActions.ADD_NODES;

    constructor(public nodes: ICommentNode[]) {
    }
  }

  export class UpdateNodes implements Action {
    readonly type = EActions.UPDATE_NODES;

    constructor(public nodes: ICommentNode[]) {
    }
  }

  export class DeleteNodes implements Action {
    readonly type = EActions.DELETE_NODES;

    constructor(public ids: string[]) {
    }
  }

  export class AddChildren implements Action {
    readonly type = EActions.ADD_CHILDREN;

    constructor(public id: string, public children: string[]) {
      if (!children) {
        debugger;
      }
    }
  }

  export class DeleteChildren implements Action {
    readonly type = EActions.DELETE_CHILDREN;

    constructor(public id: string, public children: string[]) {
    }
  }




  export type TActions =
    AddNodes
    | UpdateNodes
    | DeleteNodes
    | AddChildren
    | DeleteChildren;

}
