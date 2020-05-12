import {EntityState} from '@ngrx/entity';


export interface ICommentState {
  id: string;
  editable?: boolean;
  can_reply?: boolean;
  hidden?: boolean;
  expanded?: boolean;
  child_count?:number;
}



export interface IStateCommentState extends EntityState<ICommentState>{

}
