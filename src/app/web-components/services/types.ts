import {InjectionToken} from '@angular/core';
import {IFormattedBody} from '../comment/types';
import {Observable} from 'rxjs';
import {IEntityBase} from '@dangular-common/entity/types';
import {TFormMode} from './comment-form.service';
import {IEntityComment} from '../configs/entities/comment/comment--comment';
import {ICommentState} from '../state/comment_state/types';
import {ICommentNode} from '../state/comment_tree/types';
import {IStateCommentGlobal} from '../state/comment_global';


export const COMMENT_FORM_SERVICE = new InjectionToken<ICommentFormService>('COMMENT_FORM_SERVICE');
export const COMMENT_SERVICE = new InjectionToken<ICommentService>('COMMENT_SERVICE');
export const COMMENT_STATE_SERVICE = new InjectionToken<ICommentStateService>('COMMENT_STATE_SERVICE');

export interface ICommentFormService {
  nextId(): number;

  closeForms();

  setRootId(rootId: number);

  onFormOpen(form_id: number): Observable<boolean>;

  openForm(id: number);

  isOpen(): Observable<boolean>;
}

export interface ICommentStateService {
  createCommentState(comment:IEntityComment):ICommentState;
  addCommentStateMany(comments: IEntityComment[]);

  getComment(id): Observable<IEntityComment>;

  getCommentState(id): Observable<ICommentState>;

  setEditable(id: string, editable: boolean);

  onCommonComplete(): Observable<IStateCommentGlobal>;

  commonSetEntity(entity: IEntityBase);

  commonSetFieldName(field_name: string);
}

export interface ICommentService {
  loadComment(id: string): Observable<IEntityComment>;

  loadRoot(entity_id: string);

  loadChildren(parent_id: string);

  newComment(body: IFormattedBody, parent_id?: string);

  loadNodeComments(node: ICommentNode): Observable<IEntityComment[]>;

  saveNew(comment: IEntityComment, parent_id?: string): Observable<IEntityComment>;

  getChildrenIds(parentId: string);

  addChildren(parentId: string, children: IEntityComment[]);

  //-----------

  saveUpdate(comment: IEntityComment): Observable<IEntityComment>;

  setEntity(entity: IEntityBase);


  delete(comment: IEntityComment);

  // getCurrentEntity(): Observable<IEntity>;
  //
  // getCurrentParent(): Observable<IEntityComment>;
  nodeCollapse(node: ICommentNode);

  nodeExpand(node: ICommentNode);

}
