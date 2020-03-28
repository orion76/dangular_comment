import {InjectionToken} from '@angular/core';
import {IEntity} from '@dangular-common/entity/types';
import {Observable} from 'rxjs';
import {IRequest} from '@dangular-data/request/types';

export const ACCESS_SERVICE = new InjectionToken<IAccessService>('ACCESS_SERVICE');

export interface IAccessService {

  getToken(): Observable<IEntityUserToken>;
  getRequest(): Observable<IRequest>;
  prepareRequest(request: IRequest, token: IEntityUserToken): IRequest;
}
export interface IEntityUserToken extends IEntity {
  token: string,
}
