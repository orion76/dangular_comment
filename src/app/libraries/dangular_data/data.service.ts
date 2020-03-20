import {Inject, Injectable} from '@angular/core';
import {ENTITY_CONFIG_SERVICE, IDataService, IEntityConfigService, ITransportService, TRANSPORT_SERVICE} from './types';

import {Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {Entity} from '@dangular-common/entity/entity';
import {createFromResponse, createWithValues} from '@dangular-common/entity/utils';
import {IEntity} from '@dangular-common/entity/types';
import {IQueryParams, IRequest, IRequestService, REQUEST_SERVICE} from '@dangular-data/request/types';
import {IJsonApiEntity, IJsonApiResponse} from '@dangular-common/types/jsonapi-response';

function firstIsArray<T extends IEntity>(data: T | T[]): T {
  return Array.isArray(data) ? data[0] : data;
}

@Injectable(
  {providedIn: 'root'}
)
export class DataService implements IDataService {
  lastId = 0;

  constructor(@Inject(REQUEST_SERVICE) private requestFactory: IRequestService,
              @Inject(TRANSPORT_SERVICE) private  transport: ITransportService,
              @Inject(ENTITY_CONFIG_SERVICE) private entityConfig: IEntityConfigService
  ) {

  }

  getId() {
    return `new--${++this.lastId}`;
  }

  createWithValues<T extends IEntity>(entity_type: string, values?: Partial<T>): Observable<T> {
    return this.entityConfig.getAll().pipe(
      map((config) => createWithValues<T>(Entity, entity_type, config, {id: this.getId(), ...values}))
    );
  }

  createFromResponse<T extends IEntity>(response: IJsonApiResponse): Observable<T | T[]> {
    return this.entityConfig.getAll().pipe(
      map((configs) => {
        if (Array.isArray(response.data)) {
          return response.data
            .filter((data: IJsonApiEntity) => !!configs[data.type])
            .map((data: IJsonApiEntity) => createFromResponse<T>(Entity, configs, data, response.included));
        } else {
          return createFromResponse<T>(Entity, configs, response.data, response.included);
        }
      })
    );
  }

  add<T extends IEntity>(entity: T): Observable<T> {
    entity.id = null;
    return this.requestFactory.create('add', entity.type, {body: {data: entity.toJsonApi()}}).pipe(
      switchMap((request) => this.request(request)),
      map((entity: T) => entity)
    );
  }

  delete<T extends IEntity>(entity: T): Observable<T> {
    return this.requestFactory.create('delete', entity.type, {id: entity.id}).pipe(
      switchMap((request) => this.request(request)),
      map((entity: T) => entity)
    );
  }

  update<T extends IEntity>(entity: T): Observable<T> {
    return this.requestFactory.create('update', entity.type, {id: entity.id, body: {data: entity.toJsonApi()}}).pipe(
      switchMap((request) => this.request(request)),
      map((entity: T) => firstIsArray<T>(entity))
    );
  }

  one<T extends IEntity>(entity_type: string, params: IQueryParams): Observable<T> {
    return this.requestFactory.create('one', entity_type, params).pipe(
      switchMap((request) => this.request(request)),
      map((entity: T) => firstIsArray<T>(entity))
    );
  }

  list<T extends IEntity>(entity_type: string, params: IQueryParams): Observable<T[]> {
    return this.requestFactory.create('list', entity_type, params).pipe(
      switchMap((request) => this.request<T>(request) as Observable<T[]>),
    );
  }

  protected request<T extends IEntity>(request: IRequest): Observable<T | T[]> {

    return this.transport.request(request).pipe(
      take(1),
      // tap((response: IJsonApiResponse) => console.log('[data] REQUEST', request)),
      switchMap((response: IJsonApiResponse) => this.createFromResponse<T>(response)),
      // tap((response) => {
      //   const data = Array.isArray(response) ? response : [response];
      //   const types = Array.from(data.reduce((types, entity: T) => {
      //     types.add(entity.type);
      //     return types;
      //   }, new Set())).join(', ');
      //   console.log('[data] RESPONSE', types, response);
      // }),
    );

  }

}
