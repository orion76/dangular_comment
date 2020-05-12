import {ICommentState} from '../state/comment_state';
import {IEntityComment} from '../configs/entities/comment/comment--comment';

export type TTextFormat = 'basic_html';


export interface IComment {
  state: ICommentState;
  entity: IEntityComment
}

export interface IFormattedBody {
  value: string;
  format: TTextFormat;
  processed?: string;
}

export interface IDataTypeLike {
  sum: number;
  vote: number;
}

