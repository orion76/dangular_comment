import {Inject, Injectable} from '@angular/core';
import {ITranslateData, ITranslateService, TRANSLATE_DATA} from '@dangular-common/translate/types';

@Injectable({providedIn: 'root'})
export class TranslateService implements ITranslateService {
  debug = true;
  current = 'ru';
  default = 'en';

  constructor(@Inject(TRANSLATE_DATA) private data: ITranslateData[]) {
  }

  translate(value: string): string {
    const trans = this.data.find((data) => data[this.default] === value);
    if (this.debug && !trans) {
      console.log('[translate] not found:', value);
    }
    return (trans && trans[this.current]) ? trans[this.current] : value;
  }
}
