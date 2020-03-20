import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {CommentModule} from './web-components/comment/comment.module';
import {CommonModule} from '@angular/common';
import {DangularCommentComponent} from './app.component';
import {createCustomElement} from '@angular/elements';


@NgModule({
  declarations: [
    DangularCommentComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CommentModule,
  ],
  entryComponents: [
    DangularCommentComponent
  ],
  // bootstrap: [DangularCommentComponent]
})
export class AppModule {
  constructor(private injector: Injector) {


  }

  ngDoBootstrap() {
    const {injector} = this;
    const DangularCommentElement = createCustomElement(DangularCommentComponent, {injector});

    customElements.define('dangular-comment', DangularCommentElement);
  }
}
