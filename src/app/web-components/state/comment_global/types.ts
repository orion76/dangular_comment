import {IEntityUser} from '../../services/user/types';
import {IEntityBase} from '@dangular-common/entity/types';


export interface IStateCommentGlobal {
  uid: IEntityUser;
  entity: IEntityBase;
  field_name: string;
}

