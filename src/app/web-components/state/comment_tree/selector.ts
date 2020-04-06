import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, ICommentNode, IStateCommentTree} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {AppStateModule} from '../../../app-state.module';


export namespace CommentTreeSelect {

  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IStateCommentTree>('commentTree');

  export const Nodes = createSelector(
    State, selectEntities);

  export const NodesByIds = createSelector(
    Nodes,
    (nodes: Dictionary<ICommentNode>, props: { ids: string[] }) => {
      return props.ids.reduce((acc, id) => {
        if (nodes[id]) {
          acc[id] = nodes[id];
        }
        return acc;
      }, {});
    }
  );

  export const Node = createSelector<AppStateModule, { id: string }, Dictionary<ICommentNode>, ICommentNode>(
    Nodes,
    (nodes, props: { id: string }) => {
      // console.log('[select] - Node', {id: props.id, node: nodes[props.id]});
      return nodes[props.id];
    }
  );


  export const Children = createSelector<AppStateModule, { id: string }, ICommentNode, string[]>(
    Node,
    (node) => {
      return node ? [...node.children] : null;
    }
  );

  const selectTreeIds = (nodes: Dictionary<ICommentNode>, parentId: string): string[] => {
    if (!nodes[parentId]) {
      return [parentId];
    }

    return [...(nodes[parentId].children)].reduce(
      (ids, id) => [...ids, ...selectTreeIds(nodes, id)], [parentId]
    );
  };

  export const TreeIds = createSelector<AppStateModule, { id: string }, Dictionary<ICommentNode>, string[]>(
    Nodes,
    (nodes, props: { id: string }) => selectTreeIds(nodes, props.id)
  );

}
