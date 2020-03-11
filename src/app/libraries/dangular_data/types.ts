import {IEntity, IEntityConfig} from '@dangular-common/entity/types';
import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';
import {IQueryParams, IRequest} from '@dangular-data/request/types';
import {IJsonApiResponse} from '@dangular-common/types/jsonapi-response';

export const DATA_SERVICE = new InjectionToken<IDataService>('DATA_SERVICE');
export const TRANSPORT_SERVICE = new InjectionToken<ITransportService>('TRANSPORT_SERVICE');
export const ENTITY_CONFIG_SERVICE = new InjectionToken<IEntityConfigService>('ENTITY_CONFIG_SERVICE');

export const ENTITY_CONFIGS = new InjectionToken<IEntityConfig[]>('ENTITY_CONFIGS');

export interface ITransportService {
  request(request: IRequest): Observable<IJsonApiResponse | IJsonApiResponse[]>;

}

export interface IDataService {

  createNewFromResponse<T extends IEntity>(response: IJsonApiResponse): Observable<T[]>;

  createWithValues<T extends IEntity>(entity_type: string, values?: Partial<T>): Observable<T>;

  one<T extends IEntity>(entity_type: string, params?: IQueryParams): Observable<T>;

  list<T extends IEntity>(entity_type: string, filter: any): Observable<T[]>;

  add<T extends IEntity>(entity: T): Observable<T>;

  update<T extends IEntity>(entity: T): Observable<T>;

  delete<T extends IEntity>(entity: T): Observable<T>;

}


export interface IEntityConfigService {

  getAll(): Observable<Record<string, IEntityConfig>>;

  get(entity_type: string): Observable<IEntityConfig>;

  add(config: IEntityConfig);

  addMany(configs: IEntityConfig[]);
}


