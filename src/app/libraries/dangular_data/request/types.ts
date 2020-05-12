import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {ETypes} from '../../../web-components/configs/entities/types';
import {IFilters} from '@dangular-data/request/request.service';

export const REQUEST_SERVICE = new InjectionToken<IRequestService>('REQUEST_SERVICE');
export const REQUEST_CONFIG_SERVICE = new InjectionToken<IRequestConfigService>('REQUEST_CONFIG_SERVICE');
export const REQUEST_CONFIGS = new InjectionToken<IRequestConfig[]>('REQUEST_CONFIGS');

export interface IQueryParams extends IRequestPointConfig {
  source?: TRequestSource,
  body?: any,
}

export interface IRequestOptions {
  headers?: Record<string, string | string[]>
  params?: Record<string, string | string[]>
}

export interface IRequest {
  type: TRequestType;
  readonly url: string;
  readonly body: any;
  readonly options: IRequestOptions;
  addHeader(key: string, value: string):IRequest;
}

export interface IRequestPointConfig {
  id?: string;
  include?: string[];
  filter?: IFilters;

}

export type TRequestSource = 'default' | string;
export type TRequestType = 'one' | 'list' | 'add' | 'update' | 'delete';

export interface IRequestConfigSource {
  url: string;
  types?: Partial<Record<TRequestType, IRequestPointConfig>>;
}

export interface IRequestConfig {
  type: ETypes;
  sources: Partial<{ [K in TRequestSource]?: IRequestConfigSource }>,
}

export interface IRequestConfigService {
  get(entity_type: string): Observable<IRequestConfig>;

  set(config: IRequestConfig);
}

export interface IRequestService {
  create(type: TRequestType, entity_type: string, query: IQueryParams): Observable<IRequest>;
}
