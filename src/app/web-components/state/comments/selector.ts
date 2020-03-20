import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IStateComments} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {IEntity} from '@dangular-common/entity/types';
import {IEntityComment} from '../../comment/types';
import {StateModule} from '../state.module';


export namespace CommentsSelect {

  export const State = createFeatureSelector<IStateComments>('comments');

  const {selectEntities} = adapter.getSelectors();

  export const Entities = createSelector<StateModule, IStateComments, Dictionary<IEntityComment>>(State, selectEntities);

  export const EntityOwnerId = createSelector<StateModule, IStateComments, string>(State, (state) => state.entityOwnerId);
  export const EntityOwner = createSelector<StateModule, Dictionary<IEntity>, string, IEntity>(
    Entities,
    EntityOwnerId,
    (entities, id) => entities[id]);


  export const CommentsByIds = createSelector<StateModule, { ids: string[] }, Dictionary<IEntityComment>, IEntityComment[]>(
    Entities,
    (comments, props: { ids: string[] }) => {
      return props.ids ? props.ids.map((id: string) => {
        if(!comments[id]){
          // debugger;
        }
        return comments[id];
      }) : null;
    }
  );

  export const CommentChanged = createSelector<StateModule, { id: string }, Dictionary<IEntityComment>, string>(
    Entities,
    (comments, props: { id: string }) => {
      return comments[props.id].changed;
    });

  export const Comment = createSelector<StateModule, { id: string }, Dictionary<IEntityComment>, IEntityComment>(
    Entities,
    (comments,props: { id: string }) => {
      // console.log('!!! SELECT COMMENT',props.id,comments[props.id]);
      return comments[props.id];
    });
}
