import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {COMMENT_SERVICE, ICommentService} from '../../services/types';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {map, switchMap, tap} from 'rxjs/operators';
import {IEntityComment} from '../../comment/types';
import {EntitiesAction} from './actions';
import {CommentTreeAction} from '../comment_tree/actions';

export interface ICommentChildren {
  parentId: string,
  children: string[]
}

function orderByParents(comments: IEntityComment[]): ICommentChildren[] {
  const collection: Record<string, ICommentChildren> = {};
  comments.forEach((comment) => {
    const {id, parentId} = comment;
    debugger;
    if (!collection[parentId]) {
      collection[parentId] = {parentId, children: []};
    }
    collection[parentId].children.push(id);
  });
  return Object.values(collection);
}

@Injectable()
export class EntitiesEffects {

  effectAddComments$ = createEffect(() => this.actions$.pipe(
    ofType(EntitiesAction.EActions.ADD_COMMENTS),
    tap(() => console.log('333333')),
    map((action: EntitiesAction.AddComments) => action.comments),
    map(orderByParents),
    tap(() => console.log('444444')),
    switchMap((children: ICommentChildren[]) => children.map((data) => new CommentTreeAction.AddChildren(data.parentId, data.children))),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
  ) {
  }

}
