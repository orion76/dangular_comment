import {Inject, Injectable, Type} from '@angular/core';
import {ENTITY_CONFIG_SERVICE, IEntitiesService, IEntityConfigService} from './types';

import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {getIn, setIn} from '@dangular-common/entity/utils';
import {IEntity, IEntityConfig} from '@dangular-common/entity/types';
import {IQueryParams} from '@dangular-data/request/types';
import {IJsonApiEntityDoc, IJsonApiEntity} from '@dangular-data/types/jsonapi-response';
import {select, Store} from '@ngrx/store';
import {DataSelect} from '@dangular-data/store/entities/selector';
import {log, notEmpty} from '@dangular-common/rxjs/operators';
import {IOperation, OperationAction, OperationSelect} from '@dangular-data/store/operations';
import {Entity} from '@dangular-common/entity/entity';
import {DataAction} from '@dangular-data/store/entities';


export function getFieldSection(field: string, config: IEntityConfig): string {
  if (getIn(['attributes', field], config)) {
    return 'attributes';
  }
  if (getIn(['relationships', field], config)) {
    return 'relationships';
  }
}


@Injectable(
  {providedIn: 'root'}
)
export class EntitiesService implements IEntitiesService {

  private _lastId = 0;

  constructor(@Inject(ENTITY_CONFIG_SERVICE) private entityConfig: IEntityConfigService,
              private store: Store<any>
  ) {
  }

  getNextId() {
    return `id-${++this._lastId}`;
  }

  saveNew<T extends IEntity = IEntity>(entity_type: string, doc: IJsonApiEntityDoc): Observable<IJsonApiEntity> {
    const operation_id = this.getNextId();
    this.store.dispatch(new OperationAction.SaveNew(operation_id, entity_type, doc));
    return this.getOperationEntity(operation_id);
  }

  getEntity<T extends IEntity>(id: string) {
    return this.store.pipe(
      select(DataSelect.Entity, {id}),
    );
  }

  storeOne<T extends IEntity>(entity_type: string, values: Partial<T>) {
    return this.createJsonApiEntity(entity_type, values).pipe(
      // tap((entity: IJsonApiEntity) => this.store.dispatch(new DataAction.AddOne(entity)))
    );
  }

  saveUpdate<T extends IEntity>(entity_type: string, id: string, jsonapi: IJsonApiEntityDoc) {
    const operation_id = this.getNextId();
    this.store.dispatch(new OperationAction.SaveUpdate(operation_id, entity_type, jsonapi));
    return this.getOperationEntity(operation_id);
  }

  getOperationEntity(operation_id: string): Observable<IJsonApiEntity> {
    return this.store.pipe(
      select(OperationSelect.Operation, {operation_id}),
      filter((operation) => !!operation),
      map((operation: IOperation) => operation.entity_id),
      switchMap((id) => this.store.pipe(select(DataSelect.Entity, {id}), notEmpty())),
    );
  }

  getOperationEntities(operation_id: string): Observable<IJsonApiEntity[]> {
    return this.store.pipe(
      select(OperationSelect.Operation, {operation_id}),
      filter((operation) => operation && operation.complete),
      map((operation: IOperation) => operation.entity_ids),
      switchMap((ids) => this.store.pipe(select(DataSelect.EntitiesByIds, {ids}))),
    );
  }


  loadOne(entity_type: string, params?: IQueryParams) {
    const operation_id = this.getNextId();
    this.store.dispatch(new OperationAction.LoadOne(operation_id, entity_type, params));
    return this.getOperationEntity(operation_id);
  }

  loadMany<T extends IEntity>(entity_type: string, params: IQueryParams, operation_id?: string) {
    operation_id = operation_id || this.getNextId();
    this.store.dispatch(new OperationAction.LoadMany(operation_id, entity_type, params));
    return this.getOperationEntities(operation_id);
  }

  createFromResponseOne<T extends IEntity>(data: IJsonApiEntity) {
    // return this.entityConfig.getAll().pipe(
    //   map((configs) => {
    //     const entity: IJsonApiEntity = Array.isArray(data) ? data[0] : data;
    //     return createFromResponse<T>(Entity, configs[entity.type], entity);
    //   })
    // );
  }

  createFromResponse<T extends IEntity>(data: IJsonApiEntity[]) {
    // return this.entityConfig.getAll().pipe(
    //   map((configs) => data
    //     .filter((entity: IJsonApiEntity) => !!configs[entity.type])
    //     .map((data: IJsonApiEntity) => createFromResponse<T>(Entity, configs[data.type], data))
    //   )
    // );
  }

  createFromValues<T extends IEntity>(ctor: Type<T>, values?: Partial<T>):T {
    const entity=new ctor(values);
    this.store.dispatch(new DataAction.AddOne(entity.getJsonApiEntity()));
    return entity;
  }

  createJsonApiEntity<T extends IEntity>(entity_type: string, values?: Partial<T>): Observable<IJsonApiEntity> {

    return this.entityConfig.get(entity_type).pipe(
      log('[add] entity config get'),
      map((config) => {
        const entity: IJsonApiEntity = {type: entity_type, id: null};
        Object.keys(values).forEach((field) => {
          const section = getFieldSection(field, config);
          if (section) {
            setIn(entity, [section, field], values[field]);
          }
        });
        return entity;
      })
    );
  }

}
