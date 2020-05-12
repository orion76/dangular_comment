import {Action} from '@ngrx/store';
import {ICommentNode} from './types';

export namespace CommentTreeAction {

  export enum EActions {
    ADD_NODE = '[COMMENT TREE] ADD_NODE',
    UPDATE_NODES = '[COMMENT TREE] UPDATE_NODES',
    DELETE_NODES = '[COMMENT TREE] DELETE_NODES',
    CHILDREN_ADD = '[COMMENT TREE] CHILDREN_ADD',
    CHILDREN_DELETE = '[COMMENT TREE] CHILDREN_DELETE',
    CHILDREN_EXPAND = '[COMMENT TREE] CHILDREN_EXPAND',
    CHILDREN_COLLAPSE = '[COMMENT TREE] CHILDREN_COLLAPSE',
  }

  export class AddNode implements Action {
    readonly type = EActions.ADD_NODE;

    constructor(public node: ICommentNode) {
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

  export class ChildrenAdd implements Action {
    readonly type = EActions.CHILDREN_ADD;

    constructor(public id: string, public children: string[]) {
      if (!children) {
        debugger;
      }
    }
  }

  export class ChildrenDelete implements Action {
    readonly type = EActions.CHILDREN_DELETE;

    constructor(public id: string, public children: string[]) {
    }
  }

  export class ChildrenExpand implements Action {
    readonly type = EActions.CHILDREN_EXPAND;

    constructor(public node: ICommentNode) {
    }
  }


  export class ChildrenCollapse implements Action {
    readonly type = EActions.CHILDREN_COLLAPSE;

    constructor(public node: ICommentNode) {
    }
  }


  export type TActions =
    AddNode
    | UpdateNodes
    | DeleteNodes
    | ChildrenAdd
    | ChildrenDelete
    | ChildrenExpand
    | ChildrenCollapse;

}
