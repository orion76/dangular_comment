# DangularComments

## Цель

Разработать функционал удобной дисуккионной площадки для проведения онлайн-дискуссий.
1. Удобная навигация по дереву комментариев.   
2. Фильтрация веток дерева по различным параметрам.   
3. Удобная вставка цитат в новый комментарий.   
4. Фидбэк автору комментария (лайки-дизлайки и т.п.)
5. ... to be continued

## Описание
JS-библиотека для модуля CMS Drupal 8 реализующая web-компонент (custom element) для работы с деревом комментариев.

### Реализованные функции.
1. Дерево комментариев с подгрузкой комментариев по "уровням". При инициализации компонента с бэкенда загружается верхний уровень комментариев. Следующие уровни загружаются для каждого "родительского" комментария по кнопке-ссылке "Развернуть".

2. Форма добавления комментария, открывается по кнопке-ссылке "Ответить".

3. Форма редактирования комментария открывается по кнопке-ссылке "Изменить".

4. Для неавторизированных пользователей формы редактирования-добавления комментариев отключены.

### TODO

[] Ограничение по времени на редактирование нового комментарий.

[] Лайк-дизлайк комментария

[] кнопка "Позвать модератора"

[] Панель навигации по новым непрочитанным комментариям



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
