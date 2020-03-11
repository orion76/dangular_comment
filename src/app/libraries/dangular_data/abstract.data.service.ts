import {IEntityConfigService, ITransportService} from './types';
import {IEntity} from '@dangular-common/entity/types';
import {Observable} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Entity} from '@dangular-common/entity/entity';
import {createFromResponse} from '@dangular-common/entity/utils';
import {IRequest, IRequestService} from '@dangular-data/request/types';
import {IJsonApiResponse} from '@dangular-common/types/jsonapi-response';


export abstract class DataServiceAbstract {

  lastId = 0;

  constructor(protected requestFactory: IRequestService,
              protected transport: ITransportService,
              protected entityConfig: IEntityConfigService
  ) {
  }

  createNewFromResponse<T extends IEntity>(response: IJsonApiResponse): Observable<T[]> {
    return this.entityConfig.getAll().pipe(
      map((configs) => createFromResponse<T>(Entity, configs, response))
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
