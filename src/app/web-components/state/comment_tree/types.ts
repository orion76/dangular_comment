import {EntityState} from '@ngrx/entity';

export interface ICommentNode {
  id: string;
  isRoot?: boolean;
  expanded?: boolean;
  children?: Set<string>;
}

export interface IStateCommentTree extends EntityState<ICommentNode> {
}
