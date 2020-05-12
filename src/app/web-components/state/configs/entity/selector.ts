import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IStateConfigEntity} from './reducer';


export namespace ConfigEntitySelect {

  export const State = createFeatureSelector<IStateConfigEntity>('configEntity');

  const {selectEntities} = adapter.getSelectors();

  export const Configs = createSelector(State, selectEntities);

  export const Config = createSelector(
    Configs,
    (configs, props: { type: string }) => configs[props.type]);

}
