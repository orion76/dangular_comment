import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {COMMENT_SERVICE, COMMENT_FORM_SERVICE, ICommentService, ICommentFormService} from '../../services/types';
import {Store} from '@ngrx/store';
import {AppState} from '../app.state';
import {map, switchMap} from 'rxjs/operators';
import {IEntityComment} from '../../comment/types';
import {EntitiesAction} from './actions';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {CommentTreeAction} from '../comment_tree/actions';


@Injectable()
export class EntitiesEffects {

  effectAddComments$ = createEffect(() => this.actions$.pipe(
    ofType(EntitiesAction.EActions.ADD_COMMENTS),
    map((action: EntitiesAction.AddComments) => action.comments),
    switchMap((comments: IEntityComment[]) => fromArray(comments)),
    map((comment: IEntityComment) => new CommentTreeAction.AddChildren(comment.parentId, [comment.id])),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
  ) {
  }

}
