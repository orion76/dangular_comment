import {Inject, Injectable} from '@angular/core';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {IEntityVote, IEntityVoteRes, IVoteService} from '@dangular-components/vote/types';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../../app-state.module';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {VoteStateSelect} from '@dangular-components/vote/state/selector';
import {IFilters} from '@dangular-data/request/request.service';
import {TVoteState} from '@dangular-components/vote/state/reducer';


@Injectable({providedIn: 'root'})
export class VoteService implements IVoteService {

  constructor(@Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
              private store: Store<AppStateModule>) {
  }

  set(entity_id: string, value: number) {

  }

  get(entity_id: string): Observable<TVoteState> {
    return this.store.pipe(select(VoteStateSelect.Like, {id: entity_id}));
  }

  // add<T extends IEntityVote>(type: UVoteType, values: Partial<T>): Observable<T> {
  //   const entity_type = `vote--${type}`;
  //   return this.entities.saveNew(entity_type, values).pipe(
  //     map((entity: T) => entity)
  //   );
  // }

  loadResults(entity_type: string, ids: string[]): Observable<IEntityVoteRes[]> {
    const filter: IFilters = {
      filters: [{field: 'entity_id', value: ids}]
    };
    return this.entities.loadMany(entity_type, {filter}).pipe(
      map((entities: IEntityVoteRes[]) => entities)
    );
  }

  update<T extends IEntityVote>(entity: T): Observable<T> {
    return this.entities.saveUpdate(entity.type, entity.id, entity.getJsonApiDoc());
  }
}
