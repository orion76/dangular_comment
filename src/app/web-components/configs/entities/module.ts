import {NgModule} from '@angular/core';
import {DataModule} from '@dangular-data/data.module';

import {IEntityConfig} from '@dangular-common/entity/types';
import {configRequest as requestNodeArticle, configEntity as entityNodeArticle} from './node/node--article';
import {configRequest as requestUser, configEntityUser as entityUser} from './user/user--user';
import { configEntity as entityUserRole} from './user/user_role--user_role';
import {configRequest as requestUserToken, configEntity as entityUserToken} from './user/user--token';
import {configRequest as requestComment, configEntity as entityComment} from './comment/comment--comment';
import {configRequest as requestFile, configEntity as entityFile} from './media/file--file';
import {configRequest as requestNodeDiscussion, configEntity as entityNodeDiscussion} from './node/node--discussion';
import {configRequest as requestVoteUpdown, configEntity as entityVoteUpdown} from './vote/vote--updown';
import {configRequest as requestVoteResUpdown, configEntity as entityVoteResUpdown} from './vote/vote_res--updown';
import {IRequestConfig} from '@dangular-data/request/types';


const requestConfigs: IRequestConfig[] = [
  requestNodeArticle,
  requestNodeDiscussion,
  requestUser,
  requestUserToken,
  requestComment,
  requestFile,
  requestVoteUpdown,
  requestVoteResUpdown,
];

export const entityConfigs: IEntityConfig[] = [
  entityNodeArticle,
  entityNodeDiscussion,
  entityUser,
  entityUserRole,
  entityUserToken,
  entityComment,
  entityFile,
  entityVoteUpdown,
  entityVoteResUpdown,
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
