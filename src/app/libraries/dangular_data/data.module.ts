import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import {DATA_SERVICE, ENTITIES_SERVICE, ENTITY_CONFIG_SERVICE, ENTITY_CONFIGS, TRANSPORT_SERVICE} from './types';
import {TransportService} from './transport.service';
import {RequestService} from './request/request.service';
import {IEntityConfig} from '@dangular-common/entity/types';
import {DataService} from './data.service';
import {RequestConfigService} from './request/request-config.service';
import {EntityConfigService} from './entity-config.service';
import {IRequestConfig, REQUEST_CONFIG_SERVICE, REQUEST_CONFIGS, REQUEST_SERVICE} from '@dangular-data/request/types';
import {ACCESS_SERVICE} from '@dangular-data/access/types';
import {AccessService} from '@dangular-data/access/access.service';
import {EntitiesService} from '@dangular-data/entities.service';
import {HTTP_INTERCEPTORS, HttpInterceptor} from '@angular/common/http';


@NgModule({
  imports: [],
})
export class DataModule {

  static forRoot(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule, providers: [
        {provide: REQUEST_CONFIG_SERVICE, useClass: RequestConfigService},
        {provide: ENTITY_CONFIG_SERVICE, useClass: EntityConfigService},
        {provide: REQUEST_SERVICE, useClass: RequestService},
        {provide: TRANSPORT_SERVICE, useClass: TransportService},
        {provide: ACCESS_SERVICE, useClass: AccessService},
        {provide: DATA_SERVICE, useClass: DataService},
        {provide: ENTITIES_SERVICE, useClass: EntitiesService},
      ]
    };
  }

  static forEntityConfig(configs: IEntityConfig[]): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule, providers: [
        {provide: ENTITY_CONFIGS, useValue: configs},
      ]
    };
  }

  static forRequestConfig(configs: IRequestConfig[]): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule, providers: [
        {provide: REQUEST_CONFIGS, useValue: configs},
      ]
    };
  }

  static forInterceptor(interceptor: Type<HttpInterceptor>): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule, providers: [
        {provide: HTTP_INTERCEPTORS, useClass: interceptor, multi: true},
      ]
    };
  }

}
