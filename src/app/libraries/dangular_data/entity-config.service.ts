import {Inject, Injectable} from '@angular/core';
import {IEntityConfig} from '../dangular_common/src/lib/entity/types';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {StateModule} from '../../web-components/state/state.module';
import {ENTITY_CONFIGS, IEntityConfigService} from '@dangular-data/types';
import {ConfigEntitySelect} from '../../web-components/state/configs/entity/selector';
import {filter, take} from 'rxjs/operators';
import {ConfigEntityAction} from '../../web-components/state/configs/entity/actions';


@Injectable(
  {providedIn: 'root'}
)
export class EntityConfigService implements IEntityConfigService {

  constructor(@Inject(ENTITY_CONFIGS) protected configs: IEntityConfig[],
              protected store: Store<StateModule>) {
    this.addMany(configs);
  }

  getAll(): Observable<Record<string, IEntityConfig>> {
    return this.store.pipe(
      select(ConfigEntitySelect.Configs),
      filter(Boolean),
      take(1)
    );
  }

  get(type: string): Observable<IEntityConfig> {
    return this.store.pipe(
      select(ConfigEntitySelect.Config, {type}),
      filter(Boolean),
      take(1)
    );
  }

  add(config: IEntityConfig) {
    this.store.dispatch(new ConfigEntityAction.Add(config));
  }

  addMany(configs: IEntityConfig[]) {
    this.store.dispatch(new ConfigEntityAction.AddMany(configs));
  }

  set(config: IEntityConfig) {
  }


}
