import {InjectionToken} from '@angular/core';
import {IEntity} from '@dangular-common/entity/types';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

export const ACCESS_SERVICE = new InjectionToken<IAccessService>('ACCESS_SERVICE');

export interface IAccessHeaders {
  token: string
}

export interface IAccessService {
  addToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

export interface IEntityUserToken extends IEntity {
  token: string,
}
