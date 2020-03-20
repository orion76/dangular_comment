import {Component, Inject, Input, OnInit} from '@angular/core';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {IUserService, USER_SERVICE} from './web-components/services/user/types';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentService, ICommentStateService} from './web-components/services/types';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'dangular-comment',
  template: `
    <div class=" comments-container">
      <comment-form-reply
          [entity_id]="entity_id"
        [disabled]="disabled$|async"
        class="comment-form comment-form-root"
      ></comment-form-reply>
      <comment-list [parent_id]="entity_id" class="comment-children"></comment-list>
    </div>

  `,
})
export class DangularCommentComponent implements OnInit {

  @Input() entity_id: string;
  @Input() entity_type: string;
  @Input() field_name: string;
  disabled$: Observable<boolean>;
  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
    @Inject(DATA_SERVICE) private data: IDataService,
    @Inject(USER_SERVICE) private user: IUserService) {

  }

  ngOnInit() {

    this.user.init();
    this.initRoot();
  }

  initRoot() {
    const entity = {id: this.entity_id, type: this.entity_type};
    this.service.setEntity(entity);

    this.state.commonSetEntity(entity);
    this.state.commonSetFieldName(this.field_name);

    this.form.setRootId(this.entity_id, 'create');
    this.disabled$ = this.form.onOpenRoot().pipe(
      map((open) => !open)
    );
    this.form.openRootForm();
  }

}
