import {Action} from '@ngrx/store';
import {ICommentNode} from './reducer';

export namespace CommentTreeAction {

  export enum EActions {
    ADD_NODE = '[COMMENT TREE] ADD_NODE',
    DELETE_NODE = '[COMMENT TREE] DELETE_NODE',
    ADD_CHILDREN = '[COMMENT TREE] ADD_CHILDREN',
    DELETE_CHILDREN = '[COMMENT TREE] DELETE_CHILDREN',
  }

  export class AddNode implements Action {
    readonly type = EActions.ADD_NODE;

    constructor(public node: ICommentNode) {
    }
  }

  export class DeleteNode implements Action {
    readonly type = EActions.DELETE_NODE;

    constructor(public id: string) {
    }
  }

  export class AddChildren implements Action {
    readonly type = EActions.ADD_CHILDREN;

    constructor(public id: string, public children: string[]) {
    }
  }

  export class DeleteChildren implements Action {
    readonly type = EActions.DELETE_CHILDREN;

    constructor(public id: string, public children: string[]) {
    }
  }


  export type TActions =
 AddNode
    | DeleteNode
    | AddChildren
    | DeleteChildren;

}
