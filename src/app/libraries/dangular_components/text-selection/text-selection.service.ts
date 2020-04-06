import {ElementRef, Injectable} from '@angular/core';
import {ISelection, ITextSelectionService} from './types';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class TextSelectionService implements ITextSelectionService {

  private selectSubject= new BehaviorSubject<ISelection<any>>(null);
  private selectEvent$= this.selectSubject.asObservable();

  private isActive: boolean;
  private currentElement: ElementRef;

  constructor() {
  }

  setActive(value: boolean) {
    console.log('Text selection active', value);
    this.isActive = value;
  }

  getSelection(): Observable<ISelection<any>> {
    return this.selectEvent$.pipe(filter(Boolean));
  }

  startSelect(event: MouseEvent, element: ElementRef) {
    if (!this.isActive) {
      return;
    }
    this.currentElement = element;
  }

  endSelect(event: MouseEvent, element: ElementRef, data: any) {
    if (!this.currentElement || this.currentElement !== element) {
      return;
    }
    const selection = document.getSelection();
    const selectedText = selection.toString();
    if (!selectedText) {
      return;
    }
    event.stopPropagation();
    const {pageX, pageY} = event;
    const selectionEvent: ISelection<any> = {
      data,
      coordinate: {pageX, pageY},
      text: selectedText
    };

    this.selectSubject.next(selectionEvent);
  }
}
