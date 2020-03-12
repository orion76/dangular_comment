import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IState} from './reducer';
import {CommentTreeSelect} from '../comment_tree/selector';
import {Dictionary} from '@ngrx/entity';
import {IEntity} from '@dangular-common/entity/types';


export namespace EntitiesSelect {

  export const State = createFeatureSelector<IState>('entities');

  const {selectEntities} = adapter.getSelectors();

  export const Entities = createSelector(State, selectEntities);

  export const selectEntityOwnerId = createSelector(State, (state) => state.entityOwnerId);
  export const EntityOwner = createSelector(
    Entities,
    selectEntityOwnerId,
    (entities, id) => entities[id]);


  export const CommentsByIds = createSelector(
    Entities,
    (comments, props: { ids: string[] }) => {
      console.log('CommentsByIds', props);
      return props.ids ? props.ids.map((id: string) => comments[id]) : null;
    }
  );

  export const Comment = createSelector(
    Entities,
    (comments, props: { id: string }) => comments[props.id]);

  export const CommentChildren = createSelector(
    Entities,
    CommentTreeSelect.Children,
    (entities: Dictionary<IEntity>, ids: string[]): IEntity[] => {
      return ids ? ids.map((id) => entities[id]) : [];
    });
}
