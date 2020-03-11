import {createFeatureSelector} from '@ngrx/store';
import {IState} from './reducer';


export namespace LoggedUsersSelect {

  export const State = createFeatureSelector<IState>('loggedUser');
  export const User = State

}
