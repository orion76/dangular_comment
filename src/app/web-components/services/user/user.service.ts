import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityUser, IUserService} from './types';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {ETypes} from '../../configs/entities/types';
import {filter, map, share, take, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../../app-state.module';
import {CommentCommonAction} from '../../state/comment_common/actions';
import {CommentCommonSelect} from '../../state/comment_common/selector';

@Injectable()
export class UserService implements IUserService {
  private _loggedUser$: Observable<IEntityUser>;
  private permissions = [];

  constructor(@Inject(DATA_SERVICE) private data: IDataService,
              private store: Store<AppStateModule>
  ) {
  }

  hasPermission(permission: string): Observable<boolean> {
    if (!this.permissions[permission]) {
      this.permissions[permission] = this.loggedUser().pipe(
        map((user) => !!user.roles),
      );
    }
    return this.permissions[permission];
  }

  init() {
    this.data.one<IEntityUser>(ETypes.USER, {source: 'current'})
      .pipe(take(1))
      .subscribe((user) => {
        this.setUser(user);
      });
  }

  loggedUser(): Observable<IEntityUser> {
    if (!this._loggedUser$) {
      this._loggedUser$ = this.store.pipe(
        select(CommentCommonSelect.LoggedUser),
        filter(Boolean),
      );
    }
    return this._loggedUser$;
  }

  setUser(user: IEntityUser) {
    this.store.dispatch(new CommentCommonAction.SetUser(user));
  }


}
