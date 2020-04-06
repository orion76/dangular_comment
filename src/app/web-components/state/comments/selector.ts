import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IStateComments} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {IEntity} from '@dangular-common/entity/types';
import {AppStateModule} from '../../../app-state.module';
import {IEntityComment} from '../../configs/entities/comment/comment--comment';


export namespace CommentsSelect {

  export const State = createFeatureSelector<IStateComments>('comments');

  const {selectEntities} = adapter.getSelectors();

  export const Entities = createSelector<AppStateModule, IStateComments, Dictionary<IEntityComment>>(State, selectEntities);

  export const EntityOwnerId = createSelector<AppStateModule, IStateComments, string>(State, (state) => state.entityOwnerId);
  export const EntityOwner = createSelector<AppStateModule, Dictionary<IEntity>, string, IEntity>(
    Entities,
    EntityOwnerId,
    (entities, id) => entities[id]);


  export const CommentsByIds = createSelector<AppStateModule, { ids: string[] }, Dictionary<IEntityComment>, IEntityComment[]>(
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

  export const CommentChanged = createSelector<AppStateModule, { id: string }, Dictionary<IEntityComment>, string>(
    Entities,
    (comments, props: { id: string }) => {
      return comments[props.id].changed;
    });

  export const Comment = createSelector<AppStateModule, { id: string }, Dictionary<IEntityComment>, IEntityComment>(
    Entities,
    (comments,props: { id: string }) => {
      // console.log('!!! SELECT COMMENT',props.id,comments[props.id]);
      return comments[props.id];
    });
}
