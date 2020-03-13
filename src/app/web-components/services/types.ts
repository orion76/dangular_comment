import {InjectionToken} from '@angular/core';
import {IEntityComment} from '../comment/types';
import {Observable} from 'rxjs';
import {IEntityBase} from '@dangular-common/entity/types';
import {TFormMode} from './comment-form.service';


export const COMMENT_FORM_SERVICE = new InjectionToken<ICommentFormService>('COMMENT_FORM_SERVICE');
export const COMMENT_SERVICE = new InjectionToken<ICommentService>('COMMENT_SERVICE');

export interface ICommentFormService {

  setDefault(id: string, mode: TFormMode);

  openCreate(id: string);

  openEdit(id: string);

  openDefault();

  onOpenCreate(id): Observable<boolean>;

  onOpenEdit(id): Observable<boolean>;

}

export interface ICommentService {
  loadRoot(entity_id: string): void;

  saveNew(parentId: string, content: string);

  getChildren(parentId: string): Observable<IEntityComment[]>;
  loadChildren(parent_id: string):Observable<IEntityComment[]>
  //-----------

  saveUpdate(commentId: string, content: string);

  setEntity(entity: IEntityBase);


  delete(comment: IEntityComment);

  // getCurrentEntity(): Observable<IEntity>;
  //
  // getCurrentParent(): Observable<IEntityComment>;
}
