import {NgModule, Pipe, PipeTransform} from '@angular/core';

interface IDateRange {
  names: string[];
  start: number;
  end: number
}

/*
1 - день
2 - дня
3 - дня
4 - дня
5 - дней
6 - дней
7 - дней
8 - дней
9 - дней
10 - дней
11 - дней
12 - дней
13 - дней
14 - дней
15 - дней
16 - дней
17 - дней
18 - дней
19 - дней
20 - дней



* */


const dateIntervals: IDateRange[] = [
  {names: ['секунда', 'секунды', 'секунд'], start: 1, end: 59},
  {names: ['минута', 'минуты', 'минут'], start: 60, end: 3599},
  {names: ['час', 'часа', 'часов'], start: 3600, end: 86399},
  {names: ['день', 'дня', 'дней'], start: 86400, end: 604799},
  {names: ['неделя', 'недели', 'недель'], start: 604800, end: 2591999},
  {names: ['месяц', 'месяца', 'месяцев'], start: 2592000, end: 31535999},
  {names: ['год', 'года', 'лет'], start: 31536000, end: -1},
];

function moreThanStart(value: number, start: number) {
  return value >= start;
}


function lessThanEnd(value: number, end: number) {
  return value <= end || end === -1;
}

function getInterval(value: number): IDateRange {
  const index = dateIntervals.findIndex((item) => lessThanEnd(value, item.end) && moreThanStart(value, item.start));
  return dateIntervals[index];
}

function nameIndex(value: number): number {

  if (value < 20 && value > 10 ) {
    return 2;
  }

  const last = value % 10;

  if (last===0 || (last >= 5 && last <= 9)) {
    return 2;
  }
  if (last <= 4 && last >= 2 ) {
    return 1;
  }

  if (last === 1) {
    return 0;
  }


}

export function DateAgo(value: any) {
  if (value) {
    const seconds = Math.ceil((+new Date() - +new Date(value)) / 1000);
    const interval = getInterval(seconds);
    const counter = Math.floor(seconds / interval.start);
    const name = interval.names[nameIndex(counter)];
    return counter + ' ' + name;
  }
  return value;
}

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return DateAgo(value);
  }

}

@NgModule({
  imports: [],
  exports: [],
  declarations: [DateAgoPipe],
  providers: [],
})
export class DateAgoModule {
}
