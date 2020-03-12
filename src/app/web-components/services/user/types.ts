import {IEntity, IEntityConfig} from '@dangular-common/entity/types';
import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityFile} from '../../configs/entities/items/file--file';


export const USER_SERVICE = new InjectionToken<IUserService>('USER_SERVICE');

export interface IUserService {
  init();

  setUser(user: IEntityUser);

  loggedUser(): Observable<IEntityUser>;
}

export interface IEntityUser extends IEntity {
  display_name: string,
  langcode: string,
  mail: string,
  timezone: string,
  status: boolean,
  created: string,
  changed: string,
  access: string,
  login: string,
  label: string,
  roles: IEntity[],
  common_profiles: IEntity[],
  user_picture: IEntityFile
}

export interface IEntityConfigUser extends IEntityConfig {

}
