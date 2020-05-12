import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityUser, IUserService} from './types';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {ETypes} from '../../configs/entities/types';
import {map, take} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {AppStateModule} from '../../../app-state.module';
import {CommentGlobalAction, CommentGlobalSelect} from '../../state/comment_global';
import {createEntityOfJsonapiOne, notEmpty} from '@dangular-common/rxjs/operators';
import {EntityUser} from '../../configs/entities/user/user--user';

@Injectable()
export class UserService implements IUserService {
  private _loggedUser$: Observable<IEntityUser>;
  private permissions = [];

  constructor(@Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
              private store: Store<AppStateModule>
  ) {
  }

  hasPermission(permission: string): Observable<boolean> {
    if (!this.permissions[permission]) {
      this.permissions[permission] = this.currentUser().pipe(
        map((user) => !!user.roles),
      );
    }
    return this.permissions[permission];
  }

  init() {
    this.entities.loadOne(ETypes.USER, {source: 'current'})
      .pipe(take(1))
      .subscribe((user) => {
        this.setUser(user);
      });
  }

  currentUser(): Observable<IEntityUser> {
    if (!this._loggedUser$) {
      this._loggedUser$ = this.store.pipe(
        select(CommentGlobalSelect.CurrentUser),
        notEmpty(),
        createEntityOfJsonapiOne(EntityUser)
      );
    }
    return this._loggedUser$;
  }

  setUser(user: IEntityUser) {
    this.store.dispatch(new CommentGlobalAction.SetCurrentUser(user));
  }


}
