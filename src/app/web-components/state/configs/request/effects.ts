import {Injectable} from '@angular/core';


import {Actions} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {AppStateModule} from '../../../../app-state.module';


@Injectable()
export class ConfigRequestEffects {


  constructor(
    private actions$: Actions,
    private store: Store<AppStateModule>,
  ) {
  }

}
