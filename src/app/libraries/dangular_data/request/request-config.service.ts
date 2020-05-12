import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../../app-state.module';
import {take} from 'rxjs/operators';
import {ConfigRequestAction} from '../../../web-components/state/configs/request/actions';
import {ConfigRequestSelect} from '../../../web-components/state/configs/request/selector';
import {IRequestConfig, REQUEST_CONFIGS} from '@dangular-data/request/types';
import {notEmpty} from '@dangular-common/rxjs/operators';


export interface IRequestConfigService {
  get(type): Observable<IRequestConfig>;

  add(config: IRequestConfig);

  addMany(configs: IRequestConfig[]);
}

@Injectable(
  {providedIn: 'root'}
)
export class RequestConfigService implements IRequestConfigService {

  constructor(@Inject(REQUEST_CONFIGS) protected configs: IRequestConfig[],
              protected store: Store<AppStateModule>) {
    this.addMany(configs);
  }

  get(type: string): Observable<IRequestConfig> {
    return this.store.pipe(
      select(ConfigRequestSelect.Config, {type}),
      notEmpty(),
      take(1)

      );
  }

  add(config: IRequestConfig) {
    this.store.dispatch(new ConfigRequestAction.Add(config));
  }

  addMany(configs: IRequestConfig[]) {
    this.store.dispatch(new ConfigRequestAction.AddMany(configs));
  }


}
