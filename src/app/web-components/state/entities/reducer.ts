import {EntitiesAction} from './actions';
import {IEntityComment} from '../../comment/types';
import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import TActions = EntitiesAction.TActions;
import EActions = EntitiesAction.EActions;
import {IEntity} from '@dangular-common/entity/types';


export interface IState extends EntityState<IEntity> {
  entityOwnerId: string
}

export const adapter: EntityAdapter<IEntity> = createEntityAdapter<IEntity>({
  selectId: (comment) => comment.id,
});

export const initialState: IState = adapter.getInitialState({entityOwnerId: null});


export function reducer(state: IState = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_ENTITY: {
      const {entity} = action;
      state = {...adapter.addOne(entity, state), entityOwnerId: entity.id};
      break;
    }
    case EActions.ADD_COMMENTS: {
      const {comments} = action;
      state = adapter.addMany(comments, state);
      break;
    }
    case EActions.UPDATE_COMMENTS: {
      const {comments} = action;
      const updates: Update<IEntityComment>[] = comments.map((comment) => {
        const {id, body} = comment;
        return {id, changes: {body}};
      });

      state = adapter.updateMany(updates, state);
      break;
    }
    case EActions.DELETE_COMMENTS: {
      const {ids} = action;
      state = adapter.removeMany(ids, state);
      break;
    }
    default:
      state = {...state};
  }

  return state;
}
