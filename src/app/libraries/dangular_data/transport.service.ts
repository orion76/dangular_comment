import {Injectable} from '@angular/core';
import { ITransportService} from './types';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IRequest} from '@dangular-data/request/types';
import {IJsonApiResponse} from '@dangular-common/types/jsonapi-response';

@Injectable(
  {providedIn: 'root'}
)
export class TransportService implements ITransportService {

  constructor(private http: HttpClient) {
  }


  request(request: IRequest): Observable<IJsonApiResponse | IJsonApiResponse[]> {
    let response;
    switch (request.type) {
      case 'one':
        response = this.http.get(request.url, request.options);
        break;
      case 'list':
        response = this.http.get(request.url, request.options);
        break;
      case 'add':
        response = this.http.post(request.url, request.body, request.options);
        break;
      case 'update':
        response = this.http.patch(request.url, JSON.stringify(request.body), request.options);
        break;
      case 'delete':
        response = this.http.delete(request.url);
        break;
    }
    return response;
  }
}
