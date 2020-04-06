import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommentModule} from './web-components/comment/comment.module';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@dangular-common/translate/translate.pipe';
import {translates} from './translates';
import {DangularCommentModule} from './web-components/comment/dangular-comment.component';
import {AppStateModule} from './app-state.module';


@NgModule({

  imports: [
    CommonModule,
    BrowserModule,

    CommentModule,
    TranslateModule,
    TranslateModule.forRoot(translates),
    DangularCommentModule,
    AppStateModule
  ],
  // bootstrap: [DangularCommentComponent]
})
export class AppModule {

  ngDoBootstrap() {
  }
}
