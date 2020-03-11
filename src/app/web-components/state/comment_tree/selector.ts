import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IState} from './reducer';


export namespace CommentTreeSelect {
  const {selectEntities} = adapter.getSelectors();

  export const State = createFeatureSelector<IState>('commentTree');

  export const Nodes = createSelector(State, selectEntities);
  export const Node = createSelector(Nodes, (nodes, props: { id: string }) => nodes[props.id]);
  export const Children = createSelector(Node, (node) => {

    if(!node){
      debugger;
    }


    if(!node.children){
      debugger;
    }

    return node ? Array.from(node.children.values()) : null;
  });
}
