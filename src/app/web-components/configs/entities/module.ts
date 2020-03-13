import {NgModule} from '@angular/core';
import {DataModule} from '@dangular-data/data.module';

import {IEntityConfig} from '@dangular-common/entity/types';
import {configRequest as requestNodeArticle, configEntity as entityNodeArticle} from './items/node--article';
import {configRequest as requestUser, configEntity as entityUser} from './items/user--user';
import {configRequest as requestComment, configEntity as entityComment} from './items/comment--comment';
import {configRequest as requestFile, configEntity as entityFile} from './items/file--file';
import {configRequest as requestNodeDiscussion, configEntity as entityNodeDiscussion} from './items/node--discussion';
import {IRequestConfig} from '@dangular-data/request/types';


const requestConfigs: IRequestConfig[] = [
  requestNodeArticle,
  requestNodeDiscussion,
  requestUser,
  requestComment,
  requestFile,
];

export const entityConfigs: IEntityConfig[] = [
  entityNodeArticle,
  entityNodeDiscussion,
  entityUser,
  entityComment,
  entityFile,
];


@NgModule({
  imports: [
    DataModule.forRequestConfig(requestConfigs),
    DataModule.forEntityConfig(entityConfigs),
  ],
  exports: [],
  providers: [],
})
export class EntitiesConfigModule {
}
