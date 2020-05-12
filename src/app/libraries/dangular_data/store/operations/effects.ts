import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {DATA_SERVICE, ENTITIES_SERVICE, IDataService, IEntitiesService} from '@dangular-data/types';
import {catchError, map, switchMap} from 'rxjs/operators';
import {IJsonApiEntityDoc, IJsonApiEntity} from '@dangular-data/types/jsonapi-response';
import {of} from 'rxjs';
import {OperationAction} from '@dangular-data/store/operations/actions';
import {log} from '@dangular-common/rxjs/operators';
import {getEntityId} from '@dangular-data/store/utils';

function getResponseIdOne(response: IJsonApiEntityDoc) {
  const entity: IJsonApiEntity = Array.isArray(response.data) ? response.data[0] : response.data;
  return entity.id;
}

function getResponseIdMany(response: IJsonApiEntityDoc) {
  const entities: IJsonApiEntity[] = Array.isArray(response.data) ? response.data : [response.data];
  return entities.map((entity) => entity.id);
}


@Injectable()
export class EntitiesOperationEffects {

  SaveNew$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.SAVE_NEW),
    switchMap((action: OperationAction.SaveNew) => {
        const {operation_id, entity_type, jsonapi} = action;
        return this.data.add(entity_type, jsonapi).pipe(
          map((response: IJsonApiEntityDoc) => {
            const entity_id = getEntityId(response);
            return new OperationAction.SaveNewSuccess(operation_id, entity_type, entity_id, response);
          }),
          // catchError((err) => of(new OperationAction.SaveNewError(err)))
        );
      }
    ),
  ));


  LoadOne$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_ONE),
    switchMap((action: OperationAction.LoadOne) => this.data.one(action.entity_type, action.params).pipe(
      map((response: IJsonApiEntityDoc) => {
        const {operation_id, entity_type} = action;
        return new OperationAction.LoadOneSuccess(operation_id, entity_type, getResponseIdOne(response), response);
      }),
      catchError((err) => {
        const {operation_id, entity_type} = action;
        return of(new OperationAction.LoadOneError(operation_id, entity_type));
      })
    )),
  ));


  LoadMany$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_MANY),
    switchMap((action: OperationAction.LoadMany) => this.data.list(action.entity_type, action.params).pipe(
      map((response: IJsonApiEntityDoc) => {
        const {operation_id, entity_type} = action;
        return new OperationAction.LoadManySuccess(operation_id, entity_type, getResponseIdMany(response), response);
      })
    )),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(DATA_SERVICE) private data: IDataService,
  ) {
  }
}
