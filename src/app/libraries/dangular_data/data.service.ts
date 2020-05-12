import {Inject, Injectable} from '@angular/core';
import {ENTITY_CONFIG_SERVICE, IDataService, IEntityConfigService, ITransportService, TRANSPORT_SERVICE} from './types';

import {Observable} from 'rxjs';
import {first, switchMap, take} from 'rxjs/operators';
import {IQueryParams, IRequest, IRequestService, REQUEST_SERVICE} from '@dangular-data/request/types';
import {IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {ACCESS_SERVICE, IAccessService} from './access/types';
import {log} from '@dangular-common/rxjs/operators';


@Injectable(
  {providedIn: 'root'}
)
export class DataService implements IDataService {

  constructor(@Inject(REQUEST_SERVICE) private requestFactory: IRequestService,
              @Inject(TRANSPORT_SERVICE) private  transport: ITransportService,
              @Inject(ACCESS_SERVICE) private  access: IAccessService,
              @Inject(ENTITY_CONFIG_SERVICE) private entityConfig: IEntityConfigService
  ) {

  }

  add(entity_type: string, body: IJsonApiEntityDoc): Observable<IJsonApiEntityDoc> {
    return this.requestFactory.create('add', entity_type, {body}).pipe(
      switchMap(this.request.bind(this)), take(1));
  }

  delete(entity_type: string, id: string): Observable<IJsonApiEntityDoc> {
    return this.requestFactory.create('delete', entity_type, {id}).pipe(switchMap(this.request.bind(this)));
  }

  update(entity_type: string, id: string, body: IJsonApiEntityDoc): Observable<IJsonApiEntityDoc> {
    return this.requestFactory
      .create('update', entity_type, {id, body})
      .pipe(switchMap(this.request.bind(this)));
  }

  one(entity_type: string, params: IQueryParams): Observable<IJsonApiEntityDoc> {
    return this.requestFactory.create('one', entity_type, params).pipe(switchMap(this.request.bind(this)));
  }

  list(entity_type: string, params: IQueryParams): Observable<IJsonApiEntityDoc> {
    return this.requestFactory.create('list', entity_type, params).pipe(switchMap(this.request.bind(this)));
  }


  protected request(request: IRequest): Observable<IJsonApiEntityDoc> {
    return this.transport.request(request).pipe(
      log('[request]'),
      first(),
    );

  }


}
