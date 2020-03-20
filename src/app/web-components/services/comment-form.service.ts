import {Injectable} from '@angular/core';
import {ICommentFormService} from './types';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export type TFormMode = 'edit' | 'create';

@Injectable()
export class CommentFormService implements ICommentFormService {

  _rootId: string;
  stateSubject = new BehaviorSubject<string>(null);
  state = this.stateSubject.asObservable();

  constructor() {
  }

  onOpenCreate(id): Observable<boolean> {
    return this.onOpen(this.createId('create', id));
  }

  onOpenEdit(id): Observable<boolean> {
    return this.onOpen(this.createId('edit', id));
  }

  onOpenRoot(): Observable<boolean> {
    return this.onOpen(this._rootId);
  }

  openCreate(id: string) {
    this.stateSubject.next(this.createId('create', id));
  }

  createId(mode: TFormMode, id: string) {
    return `${mode}--${id}`;
  }

  openRootForm() {
    this.stateSubject.next(this._rootId);
  }

  openEdit(id: string) {
    this.stateSubject.next(this.createId('edit', id));
  }

  setRootId(id: string, mode: TFormMode) {
    this._rootId = this.createId(mode, id);
  }

  protected onOpen(form_id: string) {
    return this.state.pipe(
      map((state_id) => {
         return state_id === form_id;
      }),
    );
  }
}
