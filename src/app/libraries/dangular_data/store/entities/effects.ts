import {Inject, Injectable} from '@angular/core';


import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {DATA_SERVICE, ENTITIES_SERVICE, IDataService, IEntitiesService} from '@dangular-data/types';
import {DataAction} from '@dangular-data/store/entities/actions';
import {map, switchMap} from 'rxjs/operators';
import {OperationAction} from '@dangular-data/store/operations';
import {getResponseEntityMany, getResponseEntityOne} from '@dangular-data/store/entities/types';


@Injectable()
export class EntitiesEffects {

  SaveNewSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.SAVE_NEW_SUCCESS),
    switchMap((action: OperationAction.SaveNewSuccess) => {
      const {operation_id, entity_type, response} = action;
      return [
        new DataAction.AddOne(getResponseEntityOne(response)),
        new OperationAction.OperationComplete(operation_id),
      ];
    }),
  ));

  LoadOneSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_ONE_SUCCESS),
    switchMap((action: OperationAction.LoadOneSuccess) => {
      const {operation_id, entity_type, response} = action;
      return [
        new DataAction.AddOne(getResponseEntityOne(response)),
        new OperationAction.OperationComplete(operation_id),
      ];
    }),
  ));

  LoadManySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(OperationAction.EActions.LOAD_MANY_SUCCESS),
    switchMap((action: OperationAction.LoadManySuccess) => {
      const {operation_id, entity_type, response} = action;
      return [
        new DataAction.AddMany(entity_type, getResponseEntityMany(response)),
        new OperationAction.OperationComplete(operation_id),
      ];
    }),
  ));


  constructor(
    private actions$: Actions,
    private store: Store<any>,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(DATA_SERVICE) private data: IDataService,
  ) {
  }
}
