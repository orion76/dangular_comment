import {Inject, Injectable} from '@angular/core';
import {ENTITY_CONFIG_SERVICE, IDataService, IEntityConfigService, ITransportService, TRANSPORT_SERVICE} from './types';

import {Observable, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Entity} from '@dangular-common/entity/entity';
import {createFromResponse, createWithValues} from '@dangular-common/entity/utils';
import {IEntity} from '@dangular-common/entity/types';
import {IQueryParams, IRequest, IRequestService, REQUEST_SERVICE} from '@dangular-data/request/types';
import {IJsonApiResponse} from '@dangular-common/types/jsonapi-response';
import {ETypes} from '../../web-components/configs/entities/types';

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

  createNewFromResponse<T extends IEntity>(response: IJsonApiResponse): Observable<T[]> {
    return this.entityConfig.getAll().pipe(
      map((configs) => createFromResponse<T>(Entity, configs, response))
    );
  }

  add<T extends IEntity>(entity: T): Observable<T> {
    return of(entity);
  }

  delete<T extends IEntity>(entity: T): Observable<T> {
    return this.requestFactory.create('delete', entity.type, {id: entity.id}).pipe(
      switchMap((request) => this.request(request)),
      map((entities: T[]) => entities[0])
    );
  }

  update<T extends IEntity>(entity: T): Observable<T> {
    return this.requestFactory.create('update', entity.type, {body: entity}).pipe(
      switchMap((request) => this.request(request)),
      map((entities: T[]) => entities[0])
    );
  }

  one<T extends IEntity>(entity_type: string, params: IQueryParams): Observable<T> {
    return this.requestFactory.create('one', entity_type, params).pipe(
      switchMap((request) => this.request(request)),
      map((entities: T[]) => entities[0])
    );
  }

  list<T extends IEntity>(entity_type: string, params: IQueryParams): Observable<T[]> {
    return this.requestFactory.create('update', entity_type, params).pipe(
      switchMap((request) => this.request<T>(request)),
    );
  }

  protected request<T extends IEntity>(request: IRequest): Observable<T[]> {

    return this.transport.request(request).pipe(
      take(1),
      tap((response: IJsonApiResponse) => console.log('[data] REQUEST', request)),
      switchMap((response: IJsonApiResponse) => this.createNewFromResponse<T>(response)),
      tap((response) => {
        const types = Array.from(response.reduce((types, entity: T) => {
          types.add(entity.type);
          return types;
        }, new Set())).join(', ');
        console.log('[data] RESPONSE', types, response);
      }),
    );

  }

}
