import {IEntity} from '@dangular-common/entity/types';

export interface IEntityImage extends IEntity {
  file: IEntityFile;
  alt: string
}


export interface IEntityFile extends IEntity {
  url: string
}

