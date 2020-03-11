import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {COMMENT_SERVICE, EDITOR_SERVICE, ICommentService, IEditorService} from '../../services/types';
import {Store} from '@ngrx/store';
import {IAppState} from '../IAppState';
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
    private store: Store<IAppState>,
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(EDITOR_SERVICE) private editor: IEditorService,
  ) {
  }

}
