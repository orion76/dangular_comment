import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter} from './reducer';
import {Dictionary} from '@ngrx/entity';
import {AppStateModule} from '../../../../app-state.module';
import {IEntityState, IStateEntities} from '@dangular-data/store/entities/types';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';


export namespace DataSelect {

  export const State = createFeatureSelector<IStateEntities>('entities');

  const {selectEntities} = adapter.getSelectors();

  export const Entities = createSelector<AppStateModule, IStateEntities, Dictionary<IJsonApiEntity>>(State, selectEntities);



  const selectEntitiesByIds = (entities: Dictionary<IJsonApiEntity>, entity_ids: string[]): IJsonApiEntity[] => {
    return entity_ids.map((id: string) => entities[id]);
  };


  export const Entity = createSelector<AppStateModule, { id: string }, Dictionary<IJsonApiEntity>, IJsonApiEntity>(
    Entities,
    (entity, props: { id: string }) => {
      return entity[props.id];
    });
  export const EntitiesByIds = createSelector<AppStateModule, { ids: string[] }, Dictionary<IEntityState>, IJsonApiEntity[]>(
    Entities,
    (collection, props: { ids: string[] }) => {
      return props.ids.map((id) => collection[id]);
    });
  // export const JsonApi = createSelector(Entity, Entities, toJsonApi);
}
