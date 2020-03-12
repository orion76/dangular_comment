import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CommentModule} from './web-components/comment/comment.module';
import {HttpClientModule} from '@angular/common/http';
import {DataModule} from '@dangular-data/data.module';
import {AppStateModule} from './web-components/state/app.state';
import {UserModule} from './web-components/services/user/user.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppStateModule,
    HttpClientModule,
    DataModule.forRoot(),
    // DataModule.forMock(),
    UserModule,
    CommentModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
