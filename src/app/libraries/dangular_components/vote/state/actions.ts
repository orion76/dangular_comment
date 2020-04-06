import {Action} from '@ngrx/store';
import {IVoteState, TVoteState} from './reducer';
import {IEntityVote, UVoteType} from '@dangular-components/vote/types';

export namespace VoteStateAction {

  export enum EActions {
    LOAD_RESULTS = '[LIKE STATE] LOAD_RESULTS',
    ADD_RESULTS = '[LIKE STATE] ADD_RESULTS',
    UPDATE_VOTES = '[LIKE STATE] UPDATE_VOTES',
    ADD_RESULT = '[LIKE STATE] ADD_ONE',
    UPDATE_ONE = '[LIKE STATE] UPDATE_ONE',
  }

  export class LoadResults implements Action {
    readonly type = EActions.LOAD_RESULTS;

    constructor(public ids: string[],
                public entity_type: string,
                public vote_type: UVoteType) {
    }
  }


  export class AddResults implements Action {
    readonly type = EActions.ADD_RESULTS;

    constructor(public entities: TVoteState[]) {
    }
  }

  export class UpdateVotes implements Action {
    readonly type = EActions.UPDATE_VOTES;

    constructor(public votes: IEntityVote[]) {
    }
  }

  export class AddOne implements Action {
    readonly type = EActions.ADD_RESULT;

    constructor(public item: TVoteState) {
    }
  }


  export class UpdateOne implements Action {
    readonly type = EActions.UPDATE_ONE;

    constructor(public item: TVoteState) {
    }
  }


  export type TActions =
    LoadResults
    | AddOne
    | AddResults
    | UpdateVotes
    | UpdateOne;

}
