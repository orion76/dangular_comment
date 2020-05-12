import {Injectable} from '@angular/core';
import {ICommentFormService} from './types';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export type TFormMode = 'edit' | 'create';

@Injectable()
export class CommentFormService implements ICommentFormService {

  _lastId = 0;
  _rootId: number;
  stateSubject = new BehaviorSubject<number>(null);
  state$ = this.stateSubject.asObservable().pipe();

  isOpen$: Observable<boolean>;

  constructor() {
  }

  setRootId(rootId: number) {
    this._rootId = rootId;
  }

  nextId(): number {
    return ++this._lastId;
  }

  closeForms() {
    this.openForm(this._rootId);
  }


  openForm(id: number) {
    this.stateSubject.next(id);
  }


  isOpen() {
    if (!this.isOpen$) {
      this.isOpen$ = this.state$.pipe(
        map((state_id) => state_id !== this._rootId),
        distinctUntilChanged(),
      );
    }
    return this.isOpen$;
  }

  public onFormOpen(form_id: number): Observable<boolean> {
    return this.state$.pipe(
      map((state_id) => state_id === form_id),
    );
  }
}
