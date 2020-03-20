import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IStateCommentCommon} from './reducer';


export namespace CommentCommonSelect {

  export const State = createFeatureSelector<IStateCommentCommon>('commentCommon');
  export const LoggedUser = createSelector(
    State,
    (state) => state.uid
  );
  export const FieldName = createSelector(
    State,
    (state) => state.field_name
  );
  export const Entity = createSelector(
    State,
    (state) => state.entity
  );
}
