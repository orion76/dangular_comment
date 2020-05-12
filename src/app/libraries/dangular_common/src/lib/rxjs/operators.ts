import {filter, map, tap} from 'rxjs/operators';
import {Type} from '@angular/core';
import {Entity} from '@dangular-common/entity/entity';
import {IJsonApiEntity} from '@dangular-data/types/jsonapi-response';

export function log<T>(...message: any[]) {
  const prefix = ['%c[rxjs]', 'color: #060; background: #000'];
  return tap<T>((values: any) => console.log(...prefix, ...message, values));
}

export function notEmpty() {
  return filter((values: any) => !!values);
}

export function createEntityOfJsonapiOne<C extends Entity>(ctor: Type<C>) {
  return map((values: IJsonApiEntity) => new ctor(values));
}


export function createEntityOfJsonapiMany<C extends Entity>(ctor: Type<C>) {
  return map((entities: IJsonApiEntity[]) => entities.map((values) => new ctor(values)));
}
