import {Injectable} from '@angular/core';


import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {IAppState} from '../IAppState';



@Injectable()
export class LoggedUsersEffects {


  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
  ) {
  }

}
