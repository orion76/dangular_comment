import {Injectable} from '@angular/core';
import {ICommentFormService} from './types';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

export type TFormMode = 'edit' | 'create';

@Injectable()
export class CommentFormService implements ICommentFormService {

  _default: string;
  stateSubject = new BehaviorSubject<string>(null);
  state = this.stateSubject.asObservable();

  constructor() {
  }

  onOpenCreate(id): Observable<boolean> {
    return this.onOpen(id, 'create');
  }

  onOpenEdit(id): Observable<boolean> {
    return this.onOpen(id, 'edit');
  }

  openCreate(id: string) {
    this.stateSubject.next(this.createId('create', id));
  }

  createId(mode: TFormMode, id: string) {
    return `${mode}--${id}`;
  }

  openDefault() {
    this.stateSubject.next(this._default);
  }

  openEdit(id: string) {
    this.stateSubject.next(this.createId('edit', id));
  }

  setDefault(id: string, mode: TFormMode) {
    this._default = this.createId(mode, id);
  }

  protected onOpen(id: string, mode: TFormMode) {
    return this.state.pipe(
      filter(Boolean),
      map((state_id) => {
        const form_id = this.createId(mode, id);
        return state_id === form_id;
      }),

    );
  }
}
