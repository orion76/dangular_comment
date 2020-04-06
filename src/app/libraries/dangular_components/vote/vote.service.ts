import {Inject, Injectable} from '@angular/core';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IEntityVote, IEntityVoteRes, IVoteService, UVoteType} from '@dangular-components/vote/types';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../../app-state.module';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {VoteStateSelect} from '@dangular-components/vote/state/selector';
import {IFilters} from '@dangular-data/request/request.service';
import {TVoteState} from '@dangular-components/vote/state/reducer';


@Injectable({providedIn: 'root'})
export class VoteService implements IVoteService {

  constructor(@Inject(DATA_SERVICE) private data: IDataService,
              private store: Store<AppStateModule>) {
  }

  set(entity_id: string, value: number) {

  }

  get(entity_id: string): Observable<TVoteState> {
    return this.store.pipe(select(VoteStateSelect.Like, {id: entity_id}));
  }

  add<T extends IEntityVote>(type: UVoteType, values: Partial<T>): Observable<T> {
    const entity_type = `vote--${type}`;
    return this.data.createWithValues<T>(entity_type, values).pipe(
      switchMap((entity) => this.data.add(entity))
    );
  }

  loadResults(entity_type: string, ids: string[]): Observable<IEntityVoteRes[]> {
    const filter: IFilters = {
      filters: [{field: 'entity_id', value: ids}]
    };
    return this.data.list(entity_type, {filter});
  }

  update<T extends IEntityVote>(entity: T): Observable<T> {
    return this.data.update(entity);
  }
}
