import {Inject, Injectable} from '@angular/core';
import {ETypes} from '../../../web-components/configs/entities/types';
import {IAccessService, IEntityUserToken} from './types';
import {Observable, of} from 'rxjs';
import {IRequest, IRequestService, REQUEST_SERVICE} from '@dangular-data/request/types';

@Injectable()
export class AccessService implements IAccessService {

  _token: IEntityUserToken;

  constructor(@Inject(REQUEST_SERVICE) private request: IRequestService
  ) {
  }

  getToken(): Observable<IEntityUserToken> {
    return of(this._token);
  }

  getRequest(): Observable<IRequest> {
    return this.request.create('one', ETypes.USER_TOKEN, {});
  }

  prepareRequest(request: IRequest, token: IEntityUserToken): IRequest {
    this.addHeaders(request, token);
    return request;
  }

  addHeaders(request: IRequest, token: IEntityUserToken) {
    const {options} = request;
    switch (request.type) {
      case 'add':
      case 'update':
        request.addHeader('X-CSRF-Token', token.token);
        break;
    }
  }
}
