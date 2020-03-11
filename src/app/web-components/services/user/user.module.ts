import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from './user.service';
import {USER_SERVICE} from './types';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
  ],
  providers: [
    {provide: USER_SERVICE, useClass: UserService},
  ],
})
export class UserModule {
}
