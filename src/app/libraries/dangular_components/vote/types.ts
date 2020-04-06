import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';
import {IVoteState, TVoteState} from '@dangular-components/vote/state/reducer';
import {IEntity} from '@dangular-common/entity/types';

export type UVoteFunction = 'vote_average' | 'vote_count' | 'rate_count_up' | 'vote_sum';
export type UVoteType = 'updown' | 'fivestar';

export const VOTE_SERVICE = new InjectionToken('VOTE_SERVICE');
export type TUpdownState = IVoteState<IEntityVoteResUpdown>;
export interface IVote extends IEntity {
  entity_type: string;
  entity_id: IEntity;
  sum: number;
  count: number;
}

export interface IEntityVote extends IEntity {
  entity_type: string;
  entity_id: IEntity;
  user_id: IEntity;
  value: number;
}



export interface IEntityVoteRes extends IEntity {
  entity_type: string;
  entity_id: IEntity;
  user_vote: IEntityVote
}

export interface IEntityVoteResUpdown extends IEntityVoteRes {
  count: number;
  sum: number;
}

export interface IVoteService {
  set(entity_id: string, value: number);
  get(entity_id: string): Observable<TVoteState>;
  update<T extends IEntityVote>(entity: T): Observable<T>;
  loadResults(entity_type: string, ids: string[]): Observable<IEntityVoteRes[]>;
  // update(user: IEntity, entity: IEntity, vote: number): Observable<IEntity>

  // delete(user: IEntity, entity: IEntity, vote: number): Observable<IEntity>
}
