import {IEntity, IEntityConfig} from '@dangular-common/entity/types';
import {Observable} from 'rxjs';
import {InjectionToken, Type} from '@angular/core';
import {IQueryParams, IRequest} from '@dangular-data/request/types';
import {IJsonApiEntity, IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {ILoadResult} from '@dangular-data/store/utils';

export const DATA_SERVICE = new InjectionToken<IDataService>('DATA_SERVICE');
export const TRANSPORT_SERVICE = new InjectionToken<ITransportService>('TRANSPORT_SERVICE');
export const ENTITIES_SERVICE = new InjectionToken<IEntitiesService>('ENTITIES_SERVICE');
export const ENTITY_CONFIG_SERVICE = new InjectionToken<IEntityConfigService>('ENTITY_CONFIG_SERVICE');

export const ENTITY_CONFIGS = new InjectionToken<IEntityConfig[]>('ENTITY_CONFIGS');

export interface ITransportService {
  request(request: IRequest): Observable<IJsonApiEntityDoc>;

}

export interface IEntitiesService {
  getNextId():string;
  getEntity<T extends IEntity>(id: string);
  storeOne<T extends IEntity>(entity_type: string, values: Partial<T>);
  saveNew<T extends IEntity = IEntity>(entity_type:string,doc: IJsonApiEntityDoc): Observable<IJsonApiEntity>;

  saveUpdate<T extends IEntity>(entity_type: string, id: string, jsonapi: IJsonApiEntityDoc);

  loadOne(entity_type: string, params?: IQueryParams);

  loadMany<T extends IEntity>(entity_type: string, params: IQueryParams, operation_id?: string);

  createFromValues<T extends IEntity>(ctor: Type<T>, values?: Partial<T>):T;

  createFromResponse<T extends IEntity>(data: IJsonApiEntity[]);
  createFromResponseOne<T extends IEntity>(data: IJsonApiEntity);
  createJsonApiEntity<T extends IEntity>(entity_type: string, values?: Partial<T>): Observable<IJsonApiEntity>;
}

export interface IDataService {

  one(entity_type: string, params?: IQueryParams): Observable<IJsonApiEntityDoc>;

  list(entity_type: string, params: IQueryParams): Observable<IJsonApiEntityDoc>;

  add(entity_type: string, body: IJsonApiEntityDoc): Observable<IJsonApiEntityDoc>;

  update(entity_type: string, id: string, body: IJsonApiEntityDoc): Observable<IJsonApiEntityDoc>;

  delete(entity_type: string, id: string): Observable<IJsonApiEntityDoc>;

}


export interface IEntityConfigService {

  getAll(): Observable<Record<string, IEntityConfig>>;

  get(entity_type: string): Observable<IEntityConfig>;

  add(config: IEntityConfig);

  addMany(configs: IEntityConfig[]);
}


