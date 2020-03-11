import {CommentTreeAction} from './actions';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import TActions = CommentTreeAction.TActions;
import EActions = CommentTreeAction.EActions;

export interface ICommentNode {
  children?: Set<string>;
  id: string;
  parent?: string;
}

export interface IState extends EntityState<ICommentNode> {
  entityId: string
}

export const adapter: EntityAdapter<ICommentNode> = createEntityAdapter<ICommentNode>({
  selectId: (item) => item.id,
});

export const initialState: IState = adapter.getInitialState({entityId: null});

function deleteChildren(id, children, state: IState) {
  const children_set = state.entities[id].children;
  children.forEach((child: string) => children_set.delete(child));
  return adapter.updateOne({id, changes: {children: children_set}}, state);
}

function getParent(id: string, state: IState) {
  return state.entities[id].parent;
}

function getChildren(node: ICommentNode) {
  if (!node.children) {
    node.children = new Set<string>();
  }
  return node.children;
}

export function reducer(state: IState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_NODE: {
      const {node} = action;
      state = adapter.addOne(node, state);
      break;
    }
    case EActions.DELETE_NODE: {
      const {id} = action;
      const parent = getParent(id, state);
      state = adapter.removeOne(id, state);
      if (parent) {
        state = deleteChildren(parent, [id], state);
      }
      break;
    }
    case EActions.ADD_CHILDREN: {
      const {id, children} = action;
      const children_set = getChildren(state.entities[id]);
      children.forEach((child: string) => children_set.add(child));
      state = adapter.updateOne({id, changes: {children: children_set}}, state);
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
