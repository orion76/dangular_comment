import {Component, Inject, Input, OnInit, NgModule, Injector, OnDestroy, EventEmitter} from '@angular/core';
import {IUserService, USER_SERVICE} from '../services/user/types';
import {filter, map, take, tap, withLatestFrom} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {
  COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE,
  ICommentFormService, ICommentService, ICommentStateService
} from '../services/types';
import {CommentModule} from './comment.module';
import {CommonModule} from '@angular/common';
import {DATA_SERVICE, IDataService} from '@dangular-data/types';
import {createCustomElement} from '@angular/elements';
import {TimerModule} from '@dangular-components/timer/timer.component';
import {ITextSelectionService, TEXT_SELECTION_SERVICE} from '@dangular-components/text-selection/types';
import {FloatPanelModule, ICoordinate} from '@dangular-components/float-panel/float-panel.component';


@Component({
  selector: 'dangular-comments',
  template: `
    <div class="comments-container">
      <comment-form-reply
        *ngIf="canReply$|async"
        [entity_id]="entity_id"
        [disabled]="disabled$|async"
        class="comment-form comment-form-root"
      ></comment-form-reply>
      <comment-list [parent_id]="entity_id" class="comment-children"></comment-list>
    </div>
    <float-panel [onShow]="showPanel" class="float-panel-quote">
      <button (click)="showQuoteAsk()">Quote</button>
    </float-panel>
  `,
})
export class DangularCommentComponent implements OnInit, OnDestroy {

  @Input() entity_id: string;
  @Input() entity_type: string;
  @Input() field_name: string;
  disabled$: Observable<boolean>;
  canReply$: Observable<boolean>;
  _subscriptions: Subscription[] = [];
  showPanel = new EventEmitter<ICoordinate>();

  constructor(
    @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
    @Inject(DATA_SERVICE) private data: IDataService,
    @Inject(USER_SERVICE) private user: IUserService,
    @Inject(TEXT_SELECTION_SERVICE) private selection: ITextSelectionService) {
  }

  ngOnInit() {
    this.user.init();
    this.initRoot();


    this._subscriptions.push(
      this.form.isOpen().subscribe(
        (value) => this.selection.setActive(value)
      )
    );

    this._subscriptions.push(
      this.selection.getSelection().subscribe((selection) => {
        console.log('33333333', selection);
        this.showPanel.emit(selection.coordinate);
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  showQuoteAsk() {

    this.selection.getSelection().subscribe((val) => console.log('qqqqqqqqqq', val));
    this.form.isOpen().subscribe((val) => console.log('wwwwwwwww', val));

    this.form.isOpen().pipe(
      filter(Boolean),
      withLatestFrom(this.selection.getSelection(), (_, selection) => {
        this.form.insertToOpen(selection.text);
      }),
      take(1)
    ).toPromise().then(() => {
    });

  }

  initRoot() {
    const entity = {id: this.entity_id, type: this.entity_type};
    this.service.setEntity(entity);

    this.state.commonSetEntity(entity);
    this.state.commonSetFieldName(this.field_name);

    this.form.setRootId(this.entity_id, 'create');
    this.canReply$ = this.user.hasPermission('edit');

    this.disabled$ = this.form.onOpenRoot().pipe(
      map((open) => !open)
    );
    this.form.openRootForm();
  }

}


@NgModule({
  imports: [
    CommentModule,
    CommonModule,
    TimerModule,
    TimerModule,
    FloatPanelModule
  ],
  entryComponents: [DangularCommentComponent],
  declarations: [DangularCommentComponent],
  providers: [],
})
export class DangularCommentModule {
  constructor(private injector: Injector) {
    const DangularCommentElement = createCustomElement(DangularCommentComponent, {injector});
    customElements.define('dangular-comments', DangularCommentElement);
  }
}
