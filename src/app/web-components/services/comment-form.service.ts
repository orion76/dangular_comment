import {EventEmitter, Injectable} from '@angular/core';
import {ICommentFormService} from './types';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, share, tap} from 'rxjs/operators';

export type TFormMode = 'edit' | 'create';

@Injectable()
export class CommentFormService implements ICommentFormService {

  _rootId: string;
  stateSubject = new BehaviorSubject<string>(null);
  state = this.stateSubject.asObservable();

  isOpen$: Observable<boolean>;
  insertToOpen$ = new EventEmitter<string>();

  constructor() {
  }

  insertToOpen(value: string) {
    this.insertToOpen$.emit(value);
  }

  onInsertOpen(): Observable<string> {
    return this.insertToOpen$;
  }


  onOpenCreate(id): Observable<boolean> {
    return this.onFormOpen(this.createId('create', id));
  }

  onOpenEdit(id): Observable<boolean> {
    return this.onFormOpen(this.createId('edit', id));
  }

  onOpenRoot(): Observable<boolean> {
    return this.onFormOpen(this._rootId);
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

  isOpen() {
    if (!this.isOpen$) {
      this.isOpen$ = this.state.pipe(
        map((state_id) => state_id !== this._rootId),
        tap((val )=> console.log('Form open',val) ),
        distinctUntilChanged(),
        // share()
      );
    }
    return this.isOpen$;
  }

  protected onFormOpen(form_id: string) {
    return this.state.pipe(
      map((state_id) => {
        return state_id === form_id;
      }),
    );
  }
}
