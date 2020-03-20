import {CommentsAction} from './actions';
import {IEntityComment} from '../../comment/types';
import {createEntityAdapter, EntityAdapter, EntityState, Update} from '@ngrx/entity';
import TActions = CommentsAction.TActions;
import EActions = CommentsAction.EActions;


export interface IStateComments extends EntityState<IEntityComment> {
  entityOwnerId: string;
  test?: string;
}

export const adapter: EntityAdapter<IEntityComment> = createEntityAdapter<IEntityComment>({
  selectId: (comment) => comment.id,
});

export const initialState: IStateComments = adapter.getInitialState({entityOwnerId: null});


export function reducer(state: IStateComments = initialState, action: TActions) {

  switch (action.type) {
    case EActions.ADD_ENTITY: {
      const {entity} = action;
      state = {...adapter.addOne(entity as IEntityComment, state), entityOwnerId: entity.id};
      break;
    }
    case EActions.COMMENT_ADD: {
      const {comment} = action;
      state = adapter.addOne(comment, state);
      break;
    }
    case EActions.NODE_ADD_COMMENTS: {
      const {comments} = action;
      state = adapter.addMany(comments, state);
      break;
    }
    case EActions.COMMENT_UPDATE: {
      const {comment} = action;
      /**
       * Удаление предыдущей сущности, а затем вставка обновленной.
       * Иначе селектор сущности не срабатывает
       */
      state = adapter.addOne(comment, adapter.removeOne(comment.id, state));
      break;
    }
    default:
      state = {...state};
  }

  return state;
}
