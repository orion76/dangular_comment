import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {IEntityVoteRes, IVoteService, VOTE_SERVICE} from '@dangular-components/vote/types';
import {AppStateModule} from '../../../../app-state.module';
import {VoteStateAction} from '@dangular-components/vote/state/actions';
import {IUserService, USER_SERVICE} from '../../../../web-components/services/user/types';
import {map, switchMap} from 'rxjs/operators';
import {TVoteState} from '@dangular-components/vote/state/reducer';


@Injectable()
export class CommentsEffects {


  LoadResults$ = createEffect(() => this.actions$.pipe(
    ofType(VoteStateAction.EActions.LOAD_RESULTS),
    switchMap((action: VoteStateAction.LoadResults) => this.service.loadResults(action.entity_type, action.ids)),
    map((results: IEntityVoteRes[]) => results.map((vote_res) => {
      const result: TVoteState = {
        enabled: true,
        vote_result: vote_res,
        user_vote: vote_res.user_vote
      };
      return result;
    })),
    map((results: TVoteState[]) => new VoteStateAction.AddResults(results))
  ));

  // CommentsNodeLoaded$ = createEffect(() => this.actions$.pipe(
  //   ofType(CommentStateAction.EActions.EXPAND),
  //   withLatestFrom(this.user.loggedUser(), (action: VoteStateAction.LoadResults, user: IEntity) => {
  //     return this.service.
  //   })
  // ));


  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
    @Inject(USER_SERVICE) private user: IUserService,
    @Inject(VOTE_SERVICE) private service: IVoteService,
  ) {
  }
}
