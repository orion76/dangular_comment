import {Inject, Injectable} from '@angular/core';
import {ETypes} from '../../../web-components/configs/entities/types';
import {Observable, of} from 'rxjs';
import {IRequest, IRequestService, REQUEST_SERVICE} from '@dangular-data/request/types';
import {ITransportService, TRANSPORT_SERVICE} from '@dangular-data/types';
import {map, switchMap, tap} from 'rxjs/operators';
import {IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';
import {getIn} from '@dangular-common/entity/utils';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {log} from '@dangular-common/rxjs/operators';


function getTokenFromResponse(response: IJsonApiEntityDoc): string {
  return getIn(['data', 'attributes', 'token'], response);
}

@Injectable()
export class AccessService implements HttpInterceptor {

  _token = '4m7_HstS5BDyLnTupQG56jTtC57ZOgJXeFyp9jbtOPk';

  constructor(@Inject(REQUEST_SERVICE) private request: IRequestService,
              @Inject(TRANSPORT_SERVICE) private  transport: ITransportService,) {
  }

  getToken(): Observable<string> {
    return !!this._token ? of(this._token) : this.loadToken();
  }

  addToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpRequest<any>> {
    return this.getToken().pipe(
      map((token: string) => {
        const headers = req.headers.set('X-CSRF-Token', token);
        return req.clone({headers});
      }),
      // switchMap((request: HttpRequest<any>) => next.handle(request) as Observable<HttpEvent<any>>),
    );
  }

  loadToken(): Observable<string> {
    return this.getRequest().pipe(
      switchMap((request) => this.transport.request(request)),
      map(getTokenFromResponse),
      tap((token) => this._token = token),
    );
  }

  getRequest(): Observable<IRequest> {
    return this.request.create('one', ETypes.USER_TOKEN, {});
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// console.log('intercept - 111',req);
    if (req.url === '/jsonapi/token') {
      // console.log('intercept - 222',req);
      return next.handle(req.clone());
    } else {
      const headers = req.headers.set('X-CSRF-Token', this._token);
      // console.log('intercept - 333',headers);
      return next.handle(req.clone({headers}));
      // return this.addToken(req, next).pipe(
      //   switchMap((request) => next.handle(request)),
      //   log('[intercept] WITH TOKEN')
      // );
    }
  }

}
