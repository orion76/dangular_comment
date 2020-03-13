import {createFeatureSelector, createSelector} from '@ngrx/store';
import {adapter, IState} from './reducer';


export namespace ConfigRequestSelect {

  export const State = createFeatureSelector<IState>('configRequest');

  const {selectEntities} = adapter.getSelectors();

  export const Configs = createSelector(State, selectEntities);

  export const Config = createSelector(
    Configs,
    (configs, props: { type: string }) => {

      // debugger;
      return configs[props.type];
    });

}
