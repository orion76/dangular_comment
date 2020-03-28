import {InjectionToken} from '@angular/core';

const languageDefault = 'en';
const languageCurrent = 'ru';


export const TRANSLATE_DATA = new InjectionToken<ITranslateData[]>('TRANSLATE_DATA');
export const TRANSLATE_SERVICE = new InjectionToken('TRANSLATE_SERVICE');

export interface ITranslateData {
  [key: string]: string;
}

export interface ITranslateService {
  translate(value: string): string;
}
