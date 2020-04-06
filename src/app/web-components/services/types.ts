import {InjectionToken} from '@angular/core';
import {IFormattedBody} from '../comment/types';
import {Observable} from 'rxjs';
import {IEntityBase} from '@dangular-common/entity/types';
import {TFormMode} from './comment-form.service';
import {ICommentNode} from '../state/comment_tree/reducer';
import {IStateCommentCommon as ICommonState} from '../state/comment_common/reducer';
import {ICommentState} from '../state/comment_state/reducer';
import {IEntityComment} from '../configs/entities/comment/comment--comment';


export const COMMENT_FORM_SERVICE = new InjectionToken<ICommentFormService>('COMMENT_FORM_SERVICE');
export const COMMENT_SERVICE = new InjectionToken<ICommentService>('COMMENT_SERVICE');
export const COMMENT_STATE_SERVICE = new InjectionToken<ICommentStateService>('COMMENT_STATE_SERVICE');

export interface ICommentFormService {
  onInsertOpen():Observable<string>;

  insertToOpen(value: string)
  setRootId(id: string, mode: TFormMode);

  openCreate(id: string);

  openEdit(id: string);

  openRootForm();

  isOpen(): Observable<boolean>;

  onOpenRoot(): Observable<boolean>;

  onOpenCreate(id): Observable<boolean>;

  onOpenEdit(id): Observable<boolean>;

}

export interface ICommentStateService {
  getComment(id): Observable<IEntityComment>;

  getCommentState(id): Observable<ICommentState>;

  setEditable(id: string, editable: boolean);

  nodeExpand(id: string);

  nodeCollapse(id: string);

  onNodeExpanded(id: string, value: boolean): Observable<ICommentNode>;

  onNodeAdded(id: string): Observable<ICommentNode>;

  commentState(id: string): Observable<ICommentNode>;

  commonComplete(): Observable<ICommonState>;

  commonSetEntity(entity: IEntityBase);

  commonSetFieldName(field_name: string);
}

export interface ICommentService {
  loadRoot(entity_id: string): Observable<IEntityComment[]>;

  saveNew(body: IFormattedBody, pid?: IEntityComment): Observable<IEntityComment>;

  getChildren(parentId: string): Observable<string[]>;

  loadChildren(parent_id: string): Observable<IEntityComment[]>

  addChildren(parentId: string, children: IEntityComment[]);

  //-----------

  saveUpdate(commentId: string, content: string);

  setEntity(entity: IEntityBase);


  delete(comment: IEntityComment);

  // getCurrentEntity(): Observable<IEntity>;
  //
  // getCurrentParent(): Observable<IEntityComment>;
}
