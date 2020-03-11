import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityUser, IUserService} from './types';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {ETypes} from '../../configs/entities/types';
import {filter, take, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../state/IAppState';
import {LoggedUsersAction} from '../../state/logged_user/actions';
import {LoggedUsersSelect} from '../../state/logged_user/selector';

@Injectable()
export class UserService implements IUserService {

  constructor(@Inject(DATA_SERVICE) private data: IDataService,
              private store: Store<IAppState>
  ) {
  }

  init() {
    this.data.one<IEntityUser>(ETypes.USER, {source: 'current'})
      .pipe(take(1))
      .subscribe((user) => this.setUser(user));
  }

  getUser(): Observable<IEntityUser> {
    console.log('[debug] getUser');
    return this.store.pipe(
      select(LoggedUsersSelect.User),
      tap((data) => console.log('[debug] USER', data)),
      filter(Boolean)
    );
  }

  setUser(user: IEntityUser) {
    this.store.dispatch(new LoggedUsersAction.Set(user));
  }


}
