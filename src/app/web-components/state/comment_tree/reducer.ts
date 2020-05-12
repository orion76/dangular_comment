import {CommentTreeAction} from './actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Update} from '@ngrx/entity/src/models';
import {ICommentNode, IStateCommentTree} from './types';
import TActions = CommentTreeAction.TActions;
import EActions = CommentTreeAction.EActions;

export const adapter: EntityAdapter<ICommentNode> = createEntityAdapter<ICommentNode>({
  selectId: (item) => item.id,
});

export const initialState: IStateCommentTree = adapter.getInitialState({});

function deleteChildren(id, children, state: IStateCommentTree) {
  const children_set = state.entities[id].children;
  children.forEach((child: string) => children_set.delete(child));
  return adapter.updateOne({id, changes: {children: children_set}}, state);
}

function getChildren(node: ICommentNode) {
  if (!node.children) {
    node.children = new Set<string>();
  }
  return node.children;
}

function createUpdates(nodes: ICommentNode[]): Update<ICommentNode>[] {
  return nodes.map((changes: ICommentNode) => ({id: changes.id, changes}));
}

export function reducerCommentTree(state: IStateCommentTree = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_NODE: {
      const {node} = action;
      state = adapter.upsertOne(node, state);
      break;
    }
    case EActions.UPDATE_NODES: {
      const {nodes} = action;
      state = adapter.updateMany(createUpdates(nodes), state);
      break;
    }
    case EActions.DELETE_NODES: {
      const {ids} = action;
      state = adapter.removeMany(ids, state);
      break;
    }
    case EActions.CHILDREN_ADD: {
      const {id, children} = action;
      let node: ICommentNode;
      if (!state.entities[id]) {
        node = {id, children: new Set(children)};
      } else {
        node = {...state.entities[id]};
        const children_exists = getChildren(node);
        children.forEach((child: string) => children_exists.add(child));
        node.children = new Set(children_exists);
      }
      state = adapter.upsertOne(node, adapter.removeOne(node.id, state));
      break;
    }
    case EActions.CHILDREN_DELETE: {
      const {id, children} = action;
      state = deleteChildren(id, children, state);
      break;
    }

    case EActions.CHILDREN_EXPAND: {
      const {id} = action.node;
      state = adapter.updateOne({id, changes: {expanded: true}}, state);
      break;
    }
    case EActions.CHILDREN_COLLAPSE: {
      const {id} = action.node;
      state = adapter.updateOne({id, changes: {expanded: false}}, state);
      break;
    }
  }

  return state;
}
