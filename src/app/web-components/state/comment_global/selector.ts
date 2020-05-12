import {createFeatureSelector, createSelector} from '@ngrx/store';
import {IStateCommentGlobal} from './types';


export namespace CommentGlobalSelect {

  export const State = createFeatureSelector<IStateCommentGlobal>('commentGlobalState');

  export const CurrentUser = createSelector(
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
