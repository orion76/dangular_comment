import {IEntity, IEntityConfig} from '@dangular-common/entity/types';
import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {IEntityFile} from '../../configs/entities/media/file--file';


export const USER_SERVICE = new InjectionToken<IUserService>('USER_SERVICE');

export interface IUserService {
  init();

  setUser(user: IEntityUser);

  hasPermission(permission: string): Observable<boolean>;

  currentUser(): Observable<IEntityUser>;
}

export interface IEntityUser extends IEntity {
  display_name?: string,
  avatar?: string,
  langcode?: string,
  mail?: string,
  timezone?: string,
  status?: boolean,
  created?: string,
  changed?: string,
  access?: string,
  login?: string,
  label: string,
  roles?: IEntity[],
  common_profiles?: IEntity[],
}

export interface IEntityConfigUser extends IEntityConfig {

}

export interface IEntityConfigUserToken extends IEntityConfig {

}
export interface IEntityConfigUserRole extends IEntityConfig {

}
