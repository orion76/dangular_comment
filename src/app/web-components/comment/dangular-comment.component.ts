import {Component, EventEmitter, Inject, Injector, Input, NgModule, OnDestroy, OnInit} from '@angular/core';
import {IEntityUser, IUserService, USER_SERVICE} from '../services/user/types';
import {map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {COMMENT_FORM_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentStateService} from '../services/types';
import {CommentModule} from './comment.module';
import {CommonModule} from '@angular/common';
import {ENTITIES_SERVICE, IEntitiesService} from '@dangular-data/types';
import {createCustomElement} from '@angular/elements';
import {TimerModule} from '@dangular-components/timer/timer.component';
import {ITextSelectionService, TEXT_SELECTION_SERVICE} from '@dangular-components/text-selection/types';
import {FloatPanelModule, ICoordinate} from '@dangular-components/float-panel/float-panel.component';
import {EntityComment} from '../configs/entities/comment/comment--comment';


@Component({
  selector: 'dangular-comments',
  template: `
    entity_id:{{entity_id}}
    <div class="comments-container">
      <comment-form *ngIf="canReply$|async"
                    [disabled]="disabled$|async"
                    mode="reply"
                    class="comment-form comment-form-root"
      >
        <comment-author formHeader [user]="author$|async" class="comment-author comment-editor__author"></comment-author>
      </comment-form>
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
  formRootId: number;
  disabled$: Observable<boolean>;
  canReply$: Observable<boolean>;
  _subscriptions: Subscription[] = [];
  showPanel = new EventEmitter<ICoordinate>();
  author$: Observable<IEntityUser>;

  constructor(
    // @Inject(COMMENT_SERVICE) private service: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private state: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private formService: ICommentFormService,
    @Inject(ENTITIES_SERVICE) private entities: IEntitiesService,
    @Inject(USER_SERVICE) private user: IUserService,
    @Inject(TEXT_SELECTION_SERVICE) private selection: ITextSelectionService) {
  }

  ngOnInit() {
    this.formRootId = this.formService.nextId();
    this.formService.setRootId(this.formRootId);
    this.user.init();

    this.initRoot();

    this.author$ = this.user.currentUser();

    // this._subscriptions.push(
    //   this.form.isOpen().subscribe(
    //     (value) => this.selection.setActive(value)
    //   )
    // );
    //
    // this._subscriptions.push(
    //   this.selection.getSelection().subscribe((selection) => {
    //     this.showPanel.emit(selection.coordinate);
    //   })
    // );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  showQuoteAsk() {

  }

  initRoot() {
    const entity = {id: this.entity_id, type: this.entity_type};
    this.entities.createFromValues(EntityComment, entity);

    this.state.commonSetEntity(entity);
    this.state.commonSetFieldName(this.field_name);

    this.canReply$ = this.user.hasPermission('edit');

    this.disabled$ = this.formService.onFormOpen(this.formRootId).pipe(
      map((open) => !open)
    );
    this.formService.openForm(this.formRootId);
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
