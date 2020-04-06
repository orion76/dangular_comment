import {IEntityNodeArticle} from '../../../../../../web-components/configs/entities/node/node--article';
import {ETypes} from '../../../../../../web-components/configs/entities/types';
import {IEntityConfig} from '@dangular-common/entity/types';
import {IEntityUser} from '../../../../../../web-components/services/user/types';
import {createFromResponse, createNew} from '@dangular-common/entity/utils';
import {Entity} from '@dangular-common/entity/entity';
import {entityConfigs} from '../../../../../../web-components/configs/entities/module';
import {IJsonApiResponse} from '@dangular-common/types/jsonapi-response';


export const response: IJsonApiResponse = {
  data: [
    {
      type: ETypes.USER,
      id: '71041348-8852-4ed0-9658-71d16089fb8c',
      attributes: {
        logged_in: true,
        label: 'Гость',
        user_picture: 'public://default_images/Spy-icon.png'
      }
    }
  ],
};


function getConfig(configsData): Record<string, IEntityConfig> {
  return entityConfigs.reduce((configs, config) => {
    configs[config.type] = config;
    return configs;
  }, {});
};
const configs = getConfig(entityConfigs);


describe('CommentComponent', () => {


  it('should create', () => {
    const entity = createNew<IEntityNodeArticle>(Entity, ETypes.NODE_ARTICLE, configs);
    expect(entity).toBeTruthy();
  });


  it('create from response', () => {
    const data = response.data[0];
    const entity = createFromResponse<IEntityUser>(Entity, configs, response.data[0], response.included);
    expect(entity.id).toEqual(data.id);
    expect(entity.type).toEqual(data.type);
    expect(entity.label).toEqual(data.attributes.label as string);
    // expect(entity.logged_in).toEqual(data.attributes.logged_in as boolean);
    // expect(entity.user_picture).toEqual(data.attributes.user_picture as string);
    // expect(entity.type).toEqual('type');
    // expect(entity.label).toEqual('label');
    // expect(entity.content).toEqual('content');
    // expect(entity.author.type).toEqual('user');
    // expect(entity.author.id).toEqual('111');
  });


  it('change properties', () => {
    // const entity = createEntity<IEntityTest>(config, response);
    // entity.label='label_1';
    // expect(entity.label).toEqual('label_1');
  });

});
