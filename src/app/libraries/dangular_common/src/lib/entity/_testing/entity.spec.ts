import {ETypes} from '../../../../../../web-components/configs/entities/types';
import {IEntityConfig} from '@dangular-common/entity/types';
import {entityConfigs} from '../../../../../../web-components/configs/entities/module';
import {IJsonApiEntityDoc} from '@dangular-data/types/jsonapi-response';


export const response: IJsonApiEntityDoc = {
  data: [
    {
      type: ETypes.USER,
      id: '71041348-8852-4ed0-9658-71d16089fb8c',
      attributes: {
        logged_in: true,
        label: 'Гость',
        avatar: 'public://default_images/Spy-icon.png'
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
    // const entity = createNew<IEntityNodeArticle>(Entity, configs[ETypes.NODE_ARTICLE]);
    const entity = null;
    expect(entity).toBeTruthy();
  });


  it('create from response', () => {
    // const data = response.data[0];
    // const entity = createFromResponse<IEntityUser>(Entity, configs[ETypes.NODE_ARTICLE], response.data[0]);
    // expect(entity.id).toEqual(data.id);
    // expect(entity.type).toEqual(data.type);
    // expect(entity.label).toEqual(data.attributes.label as string);
    //
    // expect(entity.avatar).toEqual(data.attributes.avatar as string);

  });


  it('change properties', () => {
    // const entity = createEntity<IEntityTest>(config, response);
    // entity.label='label_1';
    // expect(entity.label).toEqual('label_1');
  });

});
