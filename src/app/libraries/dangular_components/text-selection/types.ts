import {ElementRef, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {ICoordinate} from '@dangular-components/float-panel/float-panel.component';

export const TEXT_SELECTION_SERVICE = new InjectionToken<ITextSelectionService>('TEXT_SELECTION_SERVICE');

export interface ISelection<T> {
  text: string,
  coordinate: ICoordinate,
  data?: T;
}

export interface ITextSelectionService {
  setActive(value: boolean);

  startSelect(event: MouseEvent, element: ElementRef);

  endSelect(event: MouseEvent, element: ElementRef, data: any);

  getSelection(): Observable<ISelection<any>>;
}
