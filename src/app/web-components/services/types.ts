import {InjectionToken, ViewContainerRef} from '@angular/core';
import {IEntityComment} from '../comment/types';
import {Observable} from 'rxjs';
import {IEditorContent} from './editor.service';
import {IEntityBase} from '@dangular-common/entity/types';


export const EDITOR_SERVICE = new InjectionToken<IEditorService>('EDITOR_SERVICE');
export const COMMENT_SERVICE = new InjectionToken<ICommentService>('COMMENT_SERVICE');

export interface IEditorFormService {
  readonly id: string;

  onOpen(): Observable<IEditorContent>;

  save(content: IEditorContent);
}

export interface IFormPlaceService {
  addForm(container: ViewContainerRef);

  moveForm(prev_container: ViewContainerRef, curr_container: ViewContainerRef);
}

export interface IEditorService {

  onEdit(): Observable<string>;

  save(content: string);

  cancel();

  focus(focus: boolean);

  onSave(): Observable<string>;

  onFocus(): Observable<boolean>;

  onCancel(): Observable<boolean>;

  edit(content: string);
}

export interface ICommentService {
  loadRoot(entity_id: string): void;

  saveNew(parentId: string, content: string);

  getSiblings(parentId: string): Observable<IEntityComment[]>;
  //-----------

  saveUpdate(commentId: string, content: string);

  setEntity(entity: IEntityBase);


  delete(comment: IEntityComment);

  // getCurrentEntity(): Observable<IEntity>;
  //
  // getCurrentParent(): Observable<IEntityComment>;
}
