import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {EConditionOperator, JsonApiRequest} from '@dangular-data/request/jsonapi-request';
import {IQueryParams, IRequest, IRequestConfigService, IRequestService, REQUEST_CONFIG_SERVICE, TRequestType} from '@dangular-data/request/types';

export interface IFilter {
  field: string | string[],
  value: string | string[],
}

export interface ICondition {
  path: string | string[],
  operator?: EConditionOperator,
  value?: string | string[],
}

export interface IFilters {
  filters?: IFilter[];
  conditions?: ICondition[];
}

@Injectable()
export class RequestService implements IRequestService {

  constructor(@Inject(REQUEST_CONFIG_SERVICE) private config: IRequestConfigService) {
  }

  create(type: TRequestType, entity_type: string, query: IQueryParams): Observable<IRequest> {
    return this.config.get(entity_type).pipe(
      map((config) => new JsonApiRequest(type, config, query)),
    );
  }
}
