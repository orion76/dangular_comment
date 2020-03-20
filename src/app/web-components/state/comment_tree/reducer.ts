import {CommentTreeAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Update} from '@ngrx/entity/src/models';
import TActions = CommentTreeAction.TActions;
import EActions = CommentTreeAction.EActions;

export interface ICommentNode {
  id: string;
  children?: Set<string>;
}

export interface IStateCommentTree extends EntityState<ICommentNode> {
}

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

export function reducer(state: IStateCommentTree = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_NODES: {
      const {nodes} = action;
      state = adapter.upsertMany(nodes, state);
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
    case EActions.ADD_CHILDREN: {
      const {id, children} = action;
      const node = {...state.entities[id]};
      const children_exists = getChildren(node);
      children.forEach((child: string) => children_exists.add(child));

      node.children=new Set(children_exists);

      state = adapter.addOne(node, adapter.removeOne(node.id,state));
      break;
    }
    case EActions.DELETE_CHILDREN: {
      const {id, children} = action;
      state = deleteChildren(id, children, state);
      break;
    }

    default:
      state = {...state};
  }

  return state;
}
