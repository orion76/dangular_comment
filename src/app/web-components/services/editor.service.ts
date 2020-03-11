import {EventEmitter, Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {COMMENT_SERVICE, ICommentService, IEditorService} from './types';


export interface IEditorContent {
  id: string;
  text: string;
}

@Injectable()
export class EditorService implements IEditorService {

  editEvent = new EventEmitter<string>();
  saveEvent = new EventEmitter<string>();
  cancelEvent = new EventEmitter<boolean>();
  focusEvent = new EventEmitter<boolean>();

  constructor(@Inject(COMMENT_SERVICE) private commentService: ICommentService) {
  }

  save(content: string) {

  }

  cancel() {
    this.cancelEvent.emit(true);
  }

  focus(focus: boolean) {
    this.focusEvent.emit(focus);
  }

  onFocus() {
    return this.focusEvent;
  }

  onSave():Observable<string> {
    return this.saveEvent;
  }

  onCancel() {
    return this.cancelEvent;
  }

  onEdit(): Observable<string> {
    return this.editEvent;
  }

  edit(content: string) {
    this.editEvent.emit(content);
  }

}
