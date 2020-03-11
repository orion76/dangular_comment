import {Component, Inject, OnInit} from '@angular/core';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IUserService, USER_SERVICE} from './web-components/services/user/types';

@Component({
  selector: 'app-root',
  template: `
    Comment

    <comment-list entity_type="node--article" entity_id="test_entity_id"></comment-list>
  `,
})
export class AppComponent implements OnInit {
  title = 'dangular-comments';


  constructor(@Inject(DATA_SERVICE) private data: IDataService,
              @Inject(USER_SERVICE) private user: IUserService) {

  }

  ngOnInit() {

    this.user.init();
    // this.data.createNewFromResponse<IEntityUser>(userDefault).pipe(
    //   take(1),
    //   map((users) => users[0]),
    // ).subscribe((user) => {
    //   console.log('[user] SetUser',user);
    //   this.user.setUser(user);
    // });
  }
}
